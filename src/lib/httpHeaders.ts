/**
 * 构建带附件文件名的 Content-Disposition 头。
 * HTTP 头只能是 Latin-1（ByteString），中文等非 ASCII 文件名会抛
 * "Cannot convert argument to a ByteString" 错误。
 * 这里用 RFC 5987：ASCII 回退名 + filename*（UTF-8 百分号编码）。
 */
export function attachmentDisposition(filename: string, asciiFallback: string): string {
  return `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}
