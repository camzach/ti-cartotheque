const requireContext = require.context('.', true, /.png$/);
const exportedImages: Record<string, any> = {};
requireContext.keys().forEach(key => {
  const filename = key.match(/.\/(.*).png/)?.[1];
  if (!filename) {
    return;
  }
  exportedImages[filename] = requireContext(key)
});
export default exportedImages;
