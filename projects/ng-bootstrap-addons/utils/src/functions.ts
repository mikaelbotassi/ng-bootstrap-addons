import { HttpParams } from '@angular/common/http';
import { Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Routes } from '@angular/router';
import { firstValueFrom, isObservable } from 'rxjs';

export const stopEvent = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
};

export const objectKeys = (obj: any): string[] => {
  return Object.keys(obj);
};

export const fileToBlob = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const arrayBuffer = reader.result as ArrayBuffer;
      const binaryString = String.fromCharCode(...new Uint8Array(arrayBuffer));
      resolve(btoa(binaryString));
    };
    reader.onerror = function (err) {
      reject(err);
    };
    reader.readAsArrayBuffer(file);
  });
};

export const convertToByteArray = (input: string): Uint8Array[] => {
  var sliceSize = 512;
  var bytes = [];

  for (var offset = 0; offset < input.length; offset += sliceSize) {
    var slice = input.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);

    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    bytes.push(byteArray);
  }
  return bytes;
};

// Converte o Blob do Backend em um arquivo formatado para o Frontend;
// O Item é o blob que vem do backend;
export const convertBlobToFile = (propertie: {
  nome: string;
  item: any;
}): File => {
  const type = getMimeType(propertie.nome);
  return new File(
    [new Blob(convertToByteArray(atob(propertie.item)), { type: type })],
    propertie.nome,
    { type: type }
  );
};

export const getMimeType = (fileName: string): string => {
  const extension = fileName.split('.')?.pop()?.toLowerCase();

  const mimeTypeMap: { [key: string]: string } = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    dib: 'image/bmp',
    pdf: 'application/pdf',
    txt: 'text/plain',
    json: 'application/json',
    xml: 'application/xml',
    zip: 'application/zip',
    tar: 'application/x-tar',
    rar: 'application/x-rar-compressed',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  };

  return extension ? mimeTypeMap[extension] : 'text/plain';
};

export const isset = (value: any) => value !== null && value !== undefined;

export const assignMatchingProperties = <T>(
  target: T,
  source: Partial<T>
): void => {};

export const fromObjectToParams = (data: Object): HttpParams => {
  let params = new HttpParams();

  for (let key in data)
    if (isset(data[key as keyof typeof data]))
      params = params.set(key, String(data[key as keyof typeof data]));

  return params;
};

export const fromFormObjectToParams = (data: Object): HttpParams => {
  let params = new HttpParams();

  for (let key in data) {
    const control = data[key as keyof typeof data];
    if (control instanceof FormControl && isset(control.value))
      params = params.set(key, String(control.value));
  }

  return params;
};

export const toAbsoluteUrl = (relativeUrl: string) => {
  const a = document.createElement('a');
  a.href = relativeUrl;
  return a.href;
};

export const createRangedArray = (number: Number) => {
  return new Array(number).fill(0).map((n, index) => index + 1);
};

export const getRandomArbitrary = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomChar = (origin: string) => {
  return origin[getRandomInt(0, origin.length)];
};

export const gerarNovaSenha = (comprimentoSenha: number = 12): string => {
  let senha: string = '';

  const maiusculas: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const minusculas: string = 'abcdefghijklmnopqrstuvwxyz';
  const digitos: string = '0123456789';
  const especiais: string = '!@#$%^&*';

  senha += getRandomChar(maiusculas);
  senha += getRandomChar(minusculas);
  senha += getRandomChar(especiais);
  senha += getRandomChar(digitos);

  let todosOsCaracteres: string = maiusculas + minusculas + digitos + especiais;

  for (let i: number = senha.length; i < comprimentoSenha; i++) {
    senha += getRandomChar(todosOsCaracteres);
  }

  return shuffleString(senha);
};

export const shuffleString = (origin: string): string => {
  var n = origin.length;
  const characters = origin.split('');
  for (let i = n - 1; i > 0; i--) {
    const j: number = getRandomInt(0, i + 1);
    var temp = characters[i];
    characters[i] = characters[j];
    characters[j] = temp;
  }
  return characters.join('');
};

export const createRandomString = (length: number): string => {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export async function getRoutePathForComponent<T>(
  component: Type<T>,
  routes: Routes,
  prefix = ''
): Promise<string | null> {
  async function resolveMaybeAsync<T>(
    val: T | Promise<T> | import('rxjs').Observable<T>
  ): Promise<T> {
    if (isObservable(val as any)) return firstValueFrom(val as any);
    return await (val as any);
  }

  for (const route of routes) {
    const segment = route.path ?? '';
    const base = prefix ? (segment ? `${prefix}/${segment}` : prefix) : segment;

    // 1) Rota com component direto
    if (route.component === component) {
      return `/${base}`.replace(/\/+/g, '/');
    }

    // 2) Rota com loadComponent (standalone lazy)
    if (route.loadComponent) {
      const loaded = await resolveMaybeAsync(route.loadComponent());
      if (loaded === component) {
        return `/${base}`.replace(/\/+/g, '/');
      }
    }

    // 3) Filhos estáticos
    if (route.children?.length) {
      const childPath = await getRoutePathForComponent(
        component,
        route.children,
        base
      );
      if (childPath) return childPath;
    }

    // 4) Filhos lazy (loadChildren pode devolver Routes OU um objeto com .routes)
    if (route.loadChildren) {
      const modOrRoutes = await resolveMaybeAsync(route.loadChildren());
      const childRoutes: Routes = Array.isArray(modOrRoutes)
        ? modOrRoutes
        : (modOrRoutes as any)?.routes ?? [];

      if (childRoutes.length) {
        const childPath = await getRoutePathForComponent(
          component,
          childRoutes,
          base
        );
        if (childPath) return childPath;
      }
    }
  }

  return null;
}
