import { apiHelpers } from './api';

export async function uploadFile(folder: string, file: File | Blob): Promise<UploadFileResp> {
  const form = new FormData();

  form.append('file_obj', file);

  return await apiHelpers.post(`/upload_file/${folder}`, {
    body: form,
    headers: {
      'Content-Type': 'remove',
    },
  });
}
