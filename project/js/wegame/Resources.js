import Texture2D from './graphics/Texture2D'
import Node from './Node'
import MeshRenderer from './graphics/MeshRenderer'
import Mesh from './graphics/Mesh'
import Material from './graphics/Material'
import Vector2 from './math/Vector2'
import Vector3 from './math/Vector3'
import Vector4 from './math/Vector4'
import Quaternion from './math/Quaternion'
import Color from './math/Color'
import Base64 from './Base64'

export default class Resources {
  static LoadImage(path) {
    return new Promise((resolve, reject) => {
      let image = new Image()
      image.src = path
      image.onload = () => {
        resolve(image)
      }
      image.onerror = () => {
        reject('failed to load image: ' + path)
      }
    })
  }

  static LoadTexture2D(path) {
    return new Promise((resolve, reject) => {
      Resources.LoadImage(path)
        .then(image => {
          let texture = new Texture2D(image.width, image.height)
          texture.setImage(image)
          resolve(texture)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  static LoadFile(path, encoding) {
    return new Promise((resolve, reject) => {
      if (path.startsWith('http')) {
        let task = wx.downloadFile({
          url: path,
          success: fileInfo => {
            let result = wx.getFileSystemManager().readFileSync(fileInfo.tempFilePath, encoding)
            if (result != null) {
              resolve(result)
            } else {
              reject('failed read temp file: ' + fileInfo.tempFilePath + ' from ' + path)
            }
          },
          fail: result => {
            reject('failed download file: ' + path)
          }
        })
      } else {
        let result = wx.getFileSystemManager().readFileSync(path, encoding)
        if (result != null) {
          resolve(result)
        } else {
          reject('failed read file: ' + path)
        }
      }
    })
  }

  static IsDataUri(uri) {
    return uri.startsWith('data:application/')
  }

  static IsImageUri(uri) {
    return uri.startsWith('data:image/')
  }

  static LoadUriData(gltf, cache, uri, bufferSize) {
    return new Promise((resolve, reject) => {
      if (Resources.IsDataUri(uri)) {
        let header1 = 'data:application/octet-stream;base64,'
        let header2 = 'data:application/gltf-buffer;base64,'
        let base64 = null

        if (uri.startsWith(header1)) {
          base64 = uri.substr(header1.length)
        } else if (uri.startsWith(header2)) {
          base64 = uri.substr(header2.length)
        }

        let buffer = Base64.Decode(base64)
        console.assert(buffer.byteLength == bufferSize)
        resolve(buffer)
      } else {
        // external bin
        let path = gltf.path.substring(0, gltf.path.lastIndexOf('/') + 1) + uri
        Resources.LoadFile(path, null)
          .then(buffer => {
            console.assert(buffer.byteLength == bufferSize)
            resolve(buffer)
          })
          .catch(error => {
            reject(error)
          })
      }
    })
  }

  static LoadGLTFBuffer(gltf, cache, index) {
    return new Promise((resolve, reject) => {
      if (cache.buffers[index] == null) {
        let buffer = gltf.buffers[index]
        console.assert(buffer.byteLength > 0)

        Resources.LoadUriData(gltf, cache, buffer.uri, buffer.byteLength)
          .then(data => {
            cache.buffers[index] = new DataView(data)
            resolve(index)
          })
          .catch(error => {
            reject(error)
          })
      }
    })
  }

  static AccessBuffer(gltf, cache, accessor, index, getFunc, getCount, getSize) {
    if (accessor.bufferView != null) {
      let bufferView = gltf.bufferViews[accessor.bufferView]
      if (bufferView.buffer != null) {
        let stride = getCount * getSize
        if (bufferView.byteStride != null) {
          stride = bufferView.byteStride
        }
        let offset = 0
        if (bufferView.byteOffset != null) {
          offset += bufferView.byteOffset
        }
        if (accessor.byteOffset != null) {
          offset += accessor.byteOffset
        }

        let data = cache.buffers[bufferView.buffer]
        let result = new Array(getCount)
        for (let i = 0; i < getCount; ++i) {
           result[i] = data[getFunc](offset + stride * index + i * getSize, true)
        }
        return result
      }
    }
    return null
  }

  static AccessGLTFBuffer(gltf, cache, accessorIndex, typeStr, comType, attrs, getFunc, getCount, getSize) {
    if (accessorIndex != null) {
      let accessor = gltf.accessors[accessorIndex]
      console.assert(accessor.type == typeStr)
      console.assert(accessor.componentType == comType)

      let count = accessor.count
      for (let i = 0; i < count; ++i) {
        let vs = Resources.AccessBuffer(gltf, cache, accessor, i, getFunc, getCount, getSize)
        attrs.push(vs)
      }
    }
  }

  static LoadGLTFTexture(gltf, cache, index) {
    return new Promise((resolve, reject) => {
      if (cache.textures[index] == null) {
        let texture = gltf.textures[index]
        let sampler = null

        if (texture.sampler != null) {
          sampler = gltf.samplers[texture.sampler]
        }

        if (texture.source != null) {
          let image = gltf.images[texture.source]

          if (image.bufferView != null) {
            // load buffer view image
          } else {
            if (Resources.IsImageUri(image.uri)) {
              // load uri image
              Resources.LoadImage(image.uri)
                .then(img => {
                  let wrapMode = gl.CLAMP_TO_EDGE
                  if (sampler != null) {
                    wrapMode = sampler.wrapS
                  }

                  let tex = new Texture2D(img.width, img.height, gl.LINEAR, wrapMode)
                  tex.setImage(img)

                  cache.textures[index] = tex

                  resolve(index)
                })
                .catch(error => {
                  reject(error)
                })
            } else {
              // load ext image
              let path = gltf.path.substring(0, gltf.path.lastIndexOf('/') + 1) + image.uri
              Resources.LoadTexture2D(path)
                .then(tex => {
                  cache.textures[index] = tex

                  resolve(index)
                })
                .catch(error => {
                  reject(error)
                })
            }
          }
        }
      }
    })
  }

  static LoadGLTFMesh(gltf, cache, index, createGLTFMaterial) {
    if (cache.meshes[index] != null) {
      return cache.meshes[index]
    }

    let mesh = gltf.meshes[index]

    let vertices = new Array()
    let normals = new Array()
    let tangents = new Array()
    let uv = new Array()
    let uv2 = new Array()
    let colors = new Array()
    let boneIndices = new Array()
    let boneWeights = new Array()
    let indices = new Array()
    let materials = new Array()

    let vertexCount = 0
    for (let i = 0; i < mesh.primitives.length; ++i) {
      let p = mesh.primitives[i]

      Resources.AccessGLTFBuffer(gltf, cache, p.attributes.POSITION, 'VEC3', gl.FLOAT, vertices, 'getFloat32', 3, 4)
      Resources.AccessGLTFBuffer(gltf, cache, p.attributes.NORMAL, 'VEC3', gl.FLOAT, normals, 'getFloat32', 3, 4)
      Resources.AccessGLTFBuffer(gltf, cache, p.attributes.TANGENT, 'VEC4', gl.FLOAT, tangents, 'getFloat32', 4, 4)
      Resources.AccessGLTFBuffer(gltf, cache, p.attributes.TEXCOORD_0, 'VEC2', gl.FLOAT, uv, 'getFloat32', 2, 4)
      Resources.AccessGLTFBuffer(gltf, cache, p.attributes.TEXCOORD_1, 'VEC2', gl.FLOAT, uv2, 'getFloat32', 2, 4)
      Resources.AccessGLTFBuffer(gltf, cache, p.attributes.COLOR_0, 'VEC4', gl.FLOAT, colors, 'getFloat32', 4, 4)
      Resources.AccessGLTFBuffer(gltf, cache, p.attributes.JOINTS_0, 'VEC4', gl.SHORT, boneIndices, 'getInt16', 4, 2)
      Resources.AccessGLTFBuffer(gltf, cache, p.attributes.WEIGHTS_0, 'VEC4', gl.FLOAT, boneWeights, 'getFloat32', 4, 4)

      if (p.indices != null) {
        let accessor = gltf.accessors[p.indices]
        console.assert(accessor.type == 'SCALAR')
        console.assert(accessor.componentType == gl.UNSIGNED_SHORT)

        let count = accessor.count
        let subIndices = new Array()
        for (let j = 0; j < count; ++j) {
          let vs = Resources.AccessBuffer(gltf, cache, accessor, j, 'getUint16', 1, 2)
          subIndices.push(vs[0])
        }
        indices.push(subIndices)
      } else {
        let count = vertices.length - vertexCount
        let subIndices = new Array()
        for (let j = 0; j < count; ++j) {
          subIndices.push(vertexCount + j)
        }
        indices.push(subIndices)
      }

      vertexCount += vertices.length

      if (createGLTFMaterial) {
        let mat = null
        if (p.material != null) {
          let material = gltf.materials[p.material]
          if (material.pbrMetallicRoughness != null) {
            if (material.pbrMetallicRoughness.baseColorTexture != null) {
              let textureIndex = material.pbrMetallicRoughness.baseColorTexture.index
              if (textureIndex != null) {
                mat = Material.Create('UnlitTexture')
                mat.setTexture2D('uTexture', cache.textures[textureIndex])
              }
            }
          }
        }

        if (mat == null) {
          mat = Material.Create('UnlitColor')
          mat.setColor('uColor', new Color(1, 1, 1, 1))
        }

        materials.push(mat)
      }
    }

    let attribs = new Array()
    if (vertices.length > 0) {
      attribs.push(Mesh.VERTEX_POSITION)
    }
    if (normals.length > 0) {
      attribs.push(Mesh.VERTEX_NORMAL)
    }
    if (tangents.length > 0) {
      attribs.push(Mesh.VERTEX_TANGENT)
    }
    if (uv.length > 0) {
      attribs.push(Mesh.VERTEX_UV)
    }
    if (uv2.length > 0) {
      attribs.push(Mesh.VERTEX_UV2)
    }
    if (colors.length > 0) {
      attribs.push(Mesh.VERTEX_COLOR)
    }
    if (boneIndices.length > 0) {
      attribs.push(Mesh.VERTEX_BONE_INDICES)
    }
    if (boneWeights.length > 0) {
      attribs.push(Mesh.VERTEX_BONE_WEIGHTS)
    }

    let meshOut = new Mesh(vertexCount, attribs)

    for (let i = 0; i < vertices.length; ++i) {
      let vs = vertices[i]
      meshOut.setVertex(i, new Vector3(vs[0], vs[1], -vs[2]))
    }
    for (let i = 0; i < normals.length; ++i) {
      let vs = normals[i]
      meshOut.setNormal(i, new Vector3(vs[0], vs[1], vs[2]))
    }
    for (let i = 0; i < tangents.length; ++i) {
      let vs = tangents[i]
      meshOut.setTangent(i, new Vector4(vs[0], vs[1], vs[2], vs[3]))
    }
    for (let i = 0; i < uv.length; ++i) {
      let vs = uv[i]
      meshOut.setUV(i, new Vector2(vs[0], vs[1]))
    }
    for (let i = 0; i < uv2.length; ++i) {
      let vs = uv2[i]
      meshOut.setUV2(i, new Vector2(vs[0], vs[1]))
    }
    for (let i = 0; i < colors.length; ++i) {
      let vs = colors[i]
      meshOut.setColor(i, new Color(vs[0], vs[1], vs[2], vs[3]))
    }
    for (let i = 0; i < boneIndices.length; ++i) {
      let vs = boneIndices[i]
      meshOut.setBoneIndices(i, new Vector4(vs[0], vs[1], vs[2], vs[3]))
    }
    for (let i = 0; i < boneWeights.length; ++i) {
      let vs = boneWeights[i]
      meshOut.setBoneWeights(i, new Vector4(vs[0], vs[1], vs[2], vs[3]))
    }
    for (let i = 0; i < indices.length; ++i) {
      meshOut.addIndices(indices[i])
    }

    let result = {
      mesh: meshOut,
      materials: materials
    }

    cache.meshes[index] = result

    return result
  }

  static LoadGLTFNode(gltf, cache, index, parent) {
    let node = gltf.nodes[index]

    let entity = null
    if (node.mesh != null) {
      entity = new MeshRenderer()
    } else {
      entity = new Node()
    }
    entity.setParent(parent)

    if (node.translation != null) {
      entity.setLocalPosition(new Vector3(node.translation[0], node.translation[1], node.translation[2]))
    }
    if (node.rotation != null) {
      entity.setLocalRotation(new Quaternion(node.rotation[0], node.rotation[1], node.rotation[2], node.rotation[3]))
    }
    if (node.scale != null) {
      entity.setLocalScale(new Vector3(node.scale[0], node.scale[1], node.scale[2]))
    }
    if (node.matrix != null) {

    }

    if (entity instanceof MeshRenderer) {
      let createGLTFMaterial = true

      let result = Resources.LoadGLTFMesh(gltf, cache, node.mesh, createGLTFMaterial)
      if (result != null) {
        entity.setMesh(result.mesh)

        if (createGLTFMaterial) {
          entity.setMaterials(result.materials)
        }
      }
    }

    if (node.children != null) {
      for (let i of node.children) {
        Resources.LoadGLTFNode(gltf, cache, i, entity)
      }
    }
  }

  static LoadGLTF(path) {
    return new Promise((resolve, reject) => {
      Resources.LoadFile(path, 'utf8')
        .then(file => {
          let gltf = JSON.parse(file)
          gltf.path = path

          let cache = {
            meshes: new Array(gltf.meshes.length),
            buffers: new Array(gltf.buffers.length)
          }

          if (gltf.textures != null) {
            cache.textures = new Array(gltf.textures.length)
          }

          let isBufferTextureLoaded = () => {
            let loaded = true

            for (let i = 0; i < cache.buffers.length; ++i) {
              if (cache.buffers[i] == null) {
                loaded = false
                break
              }
            }

            if (cache.textures != null) {
              for (let i = 0; i < cache.textures.length; ++i) {
                if (cache.textures[i] == null) {
                  loaded = false
                  break
                }
              }
            }

            return loaded
          }
          let loadScene = () => {
            let sceneIndex = 0
            if (gltf.scene != null) {
              sceneIndex = gltf.scene
            }

            let scene = gltf.scenes[sceneIndex]
            let entity = new Node()

            for (let i of scene.nodes) {
              Resources.LoadGLTFNode(gltf, cache, i, entity)
            }

            resolve(entity)
          }

          for (let i = 0; i < cache.buffers.length; ++i) {
            Resources.LoadGLTFBuffer(gltf, cache, i)
              .then(index => {
                if (isBufferTextureLoaded()) {
                  loadScene()
                }
              })
              .catch(error => {
                reject(error)
              })
          }

          if (gltf.textures != null) {
            for (let i = 0; i < cache.textures.length; ++i) {
              Resources.LoadGLTFTexture(gltf, cache, i)
                .then(index => {
                  if (isBufferTextureLoaded()) {
                    loadScene()
                  }
                })
                .catch(error => {
                  reject(error)
                })
            }
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
