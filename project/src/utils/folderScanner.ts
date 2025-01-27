export async function* scanFolder(handle: FileSystemDirectoryHandle): AsyncGenerator<File> {
  const entries = await handle.values();
  
  for await (const entry of entries) {
    if (entry.kind === 'file') {
      const file = await entry.getFile();
      if (file.type.startsWith('audio/')) {
        yield file;
      }
    } else if (entry.kind === 'directory') {
      yield* scanFolder(entry);
    }
  }
}