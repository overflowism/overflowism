# Overflowism

A small, static interactive gallery. No accounts, database, or payment service are required.

## Run it locally

Install [Node.js](https://nodejs.org/) 18 or newer, then run:

```sh
npm run build
npm run preview
```

Open the address printed in the terminal. The build copies the site into `dist/`; it has no third-party dependencies. You can also serve the project folder with any static web server.

## Make the gallery yours

The current paintings and artist biography are **placeholders**. Replace them before presenting the gallery as a collection of real work.

1. Put your painting images in `images/artworks/`. JPG, PNG, WebP, and SVG files work. Keep file names simple, such as `blue-dream.jpg`.
2. Open `gallery-data.js` in a text editor. For each of the three paintings, update its `title`, `description`, `image`, `alt`, and `details`. Set `placeholder` to `false` when you have replaced the image and text. Keep the quotes and commas in place. The three entries correspond to the left, center, and right frames.
3. Update `artist.bio` and `artist.note` in the same file. Set `artist.placeholder` to `false` when the biography is ready.
4. Set `contactEmail` to your own email address. Until you do, the inquiry button opens an email draft with no recipient. The artwork title is included in the subject.
5. To replace the room illustration, add your image to `images/` and change `roomImage` in `gallery-data.js`. The artwork hotspots are positioned over the existing room, so a replacement should use the same wide 16:9 layout and frame positions, or you will need to adjust the `.artwork--1`, `.artwork--2`, and `.artwork--3` positions in `styles.css`.

The provided placeholder artwork is original to this project. For best results, use portrait-oriented images. Review the site on a phone and a computer after making changes.

## Publish with GitHub Pages

The workflow in `.github/workflows/pages.yml` builds and deploys the site when changes are pushed to `main`. In the repository on GitHub, open **Settings → Pages**, and under **Build and deployment**, choose **GitHub Actions** as the source. After the pull request is merged, check the **Actions** tab for the deployment. The published address will appear in **Settings → Pages**. If the workflow has not run yet, run it manually from the Actions tab.

All asset paths are relative, so the site also works at a GitHub Pages project subpath.
