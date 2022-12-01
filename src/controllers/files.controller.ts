import {inject} from '@loopback/core';
import {get, HttpErrors, oas, param, post, Request, requestBody, Response, response, RestBindings} from '@loopback/rest';
import multer from 'multer';
import path from 'path';
import {Keys as llaves} from '../config/keys';

export class FilesController {
  constructor() {}

  /* Crgar imagen de una mascota */
  @post('/pets/upload/photo')
  @response(200, {
    description: 'Carga de imagen de una mascota',
  })
  async uploadPetPhoto(@inject(RestBindings.Http.RESPONSE) response: Response, @requestBody.file() request: Request): Promise<object | false> {
    const rutaImgen = path.join(__dirname, llaves.carpetaPetImagen);
    let res = await this.StoreFileToPath(rutaImgen, llaves.nombreCampoImagenPet, request, response, llaves.extencionesPermitidas);
    if (res) {
      const nombreArchivo = response.req?.file?.filename;
      if (nombreArchivo) return {filename: nombreArchivo};
    }
    return res;
  }

  @get('/pets/file/photo/{filename}')
  @oas.response.file()
  async downloadFile(@param.path.string('filename') filename: string, @inject(RestBindings.Http.RESPONSE) response: Response) {
    const rutaCarpeta = this.getRutaCarpeta();
    const archivo = this.validateNameFile(rutaCarpeta, filename);
    response.download(archivo, rutaCarpeta);
    return response;
  }

  private validateNameFile(archivo: string, folder: string) {
    const resolved = path.resolve(archivo, folder);
    if (resolved.startsWith(archivo)) return resolved;
    throw new HttpErrors[400]('La ruta del archivo no existe');
  }

  private getRutaCarpeta() {
    let ruta = path.join(__dirname, llaves.carpetaPetImagen);
    return ruta;
  }

  private StoreFileToPath(storePath: string, fieldName: string, request: Request, response: Response, acceptedExt: string[]) {
    return new Promise<object>((resolve, reject) => {
      const storage = this.GetMulterStorageConfig(storePath);
      const upload = multer({
        storage: storage,
        fileFilter: function (req: any, file: any, callback: any) {
          var ext = path.extname(file.originalname).toUpperCase();
          if (acceptedExt.includes(ext)) {
            return callback(null, true);
          }
          return callback(new HttpErrors[400]('Extension de archivo no permitida'));
        },
        limits: {
          fileSize: llaves.tamMaxImagen,
        },
      }).single(fieldName);
      upload(request, response, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

  private GetMulterStorageConfig(path: string) {
    var filename: string = '';
    const storage = multer.diskStorage({
      destination: function (req: any, file: any, cb: any) {
        cb(null, path);
      },
      filename: function (req: any, file: any, cb: any) {
        filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    });
    return storage;
  }
}
