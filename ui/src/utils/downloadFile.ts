export default function downloadFile(response: any, fileName: string) {
    // Create a new Blob from the response data
    const blob = new Blob([response.data], {type: response.headers['content-type']});

    // Create a link element
    const link = document.createElement('a');

    // Generate a URL for the Blob and set it as the href
    const url = window.URL.createObjectURL(blob);
    link.href = url;

    // Optional: You can set a default file name or derive it from the response headers
    link.setAttribute('download', fileName); // Change extension based on file type

    // Append the link to the document body and trigger the download
    document.body.appendChild(link);
    link.click();

    // Cleanup: Remove the link and revoke the object URL
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
