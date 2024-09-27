# Your Project Name

## Deployment

This project is configured to deploy to GitHub Pages when a new tag is pushed to the repository. 

### How to Deploy
1. Create a new tag using the following command:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
2. The GitHub Actions workflow will automatically build and deploy the project to GitHub Pages.
