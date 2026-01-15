
import { AppConcept, AppFile } from "../types";

export interface GithubDeploymentProgress {
  step: 'idle' | 'creating-repo' | 'uploading-files' | 'completed' | 'error';
  message: string;
  repoUrl?: string;
}

/**
 * Encodes a string to Base64 safely handling UTF-8 characters.
 */
const toBase64 = (str: string) => {
  try {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => 
        String.fromCharCode(parseInt(p1, 16))
      )
    );
  } catch (e) {
    console.error("UTF-8 encoding failed, falling back to standard btoa", e);
    return btoa(str);
  }
};

export const deployToGithub = async (
  token: string,
  concept: AppConcept,
  repoName: string,
  isPrivate: boolean,
  onProgress: (p: GithubDeploymentProgress) => void
) => {
  const headers = {
    Authorization: `token ${token}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };

  try {
    // 1. Create Repository
    onProgress({ step: 'creating-repo', message: `Creating repository "${repoName}"...` });
    
    const createRepoRes = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: repoName,
        description: concept.summary || `Built with App Architect: ${concept.tagLine}`,
        private: isPrivate,
        auto_init: false,
      }),
    });

    if (!createRepoRes.ok) {
      const err = await createRepoRes.json();
      throw new Error(err.message || "Failed to create repository");
    }

    const repoData = await createRepoRes.json();
    const owner = repoData.owner.login;
    const repo = repoData.name;

    // 2. Upload Files
    onProgress({ step: 'uploading-files', message: "Initializing file transfers..." });

    const uploadFile = async (file: AppFile) => {
      let content = file.content;
      
      // Handle data URIs (images/binaries) or plain text
      if (content.startsWith('data:') && content.includes(';base64,')) {
        content = content.split(';base64,')[1];
      } else {
        content = toBase64(content);
      }
      
      const uploadRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${file.name}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            message: `Initial commit: Added ${file.name} via App Architect`,
            content: content,
          }),
        }
      );

      if (!uploadRes.ok) {
        const err = await uploadRes.json();
        throw new Error(`Failed to upload ${file.name}: ${err.message}`);
      }
    };

    // Sequential upload to avoid race conditions and respect rate limits
    for (const [index, file] of concept.files.entries()) {
      onProgress({ 
        step: 'uploading-files', 
        message: `Pushing ${file.name} (${index + 1}/${concept.files.length})...` 
      });
      await uploadFile(file);
    }

    // 3. Complete
    onProgress({ 
      step: 'completed', 
      message: "Deployment successful!", 
      repoUrl: repoData.html_url 
    });

  } catch (error: any) {
    onProgress({ 
      step: 'error', 
      message: error.message || "An unexpected error occurred during GitHub deployment." 
    });
  }
};
