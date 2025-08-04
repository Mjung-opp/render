function onDriveUpload() {
  const folderId = '1X4Iw0fPXu3REJS21EYiRV_iQYmaKEcz4';
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();

  const webhookUrl = 'https://<YOUR-AGENT-URL>/upload-image';

  while (files.hasNext()) {
    const file = files.next();
    const name = file.getName().toLowerCase();

    if (name.includes('black') && name.includes('no')) {
      const publicUrl = 'https://drive.google.com/uc?export=view&id=' + file.getId();
      const payload = {
        file_name: file.getName(),
        image_url: publicUrl
      };

      const options = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload)
      };

      UrlFetchApp.fetch(webhookUrl, options);
    }
  }
}