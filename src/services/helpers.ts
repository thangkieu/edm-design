export function getFileUrl(path?: string) {
  if (!path) return '';

  return `/download_file/${window.btoa(unescape(encodeURIComponent(path.replace(/^\//, ''))))}`;
}

export function getS3ImageUrl(path?: string) {
  if (!path) return '';

  if (path.includes('/download_file')) return path;

  return `${process.env?.REACT_APP_BASE_API}/pidove${getFileUrl(path)}`;
}
