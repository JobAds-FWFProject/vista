
const repo = 'vista';

const isGithubPages = process.env.GITHUB_PAGES === 'true';


const nextConfig = {
  output: 'export',
  basePath: isGithubPages ? `/${repo}` : '',
  assetPrefix: isGithubPages ? `/${repo}/` : '',
  trailingSlash: true,

  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,

  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
}

module.exports = nextConfig

