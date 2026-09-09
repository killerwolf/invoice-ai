import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const framesDir = path.resolve(rootDir, "temp_frames");
const publicDir = path.resolve(rootDir, "public");
const invoiceFile = path.resolve(publicDir, "sample-invoice.png");
const gifOutput = path.resolve(publicDir, "demo.gif");
const mp4Output = path.resolve(publicDir, "demo.mp4");

const chromePath =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

if (fs.existsSync(framesDir)) {
  fs.rmSync(framesDir, { recursive: true, force: true });
}
fs.mkdirSync(framesDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--window-size=1280,860",
      "--disable-notifications",
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: 1200,
    height: 800,
    deviceScaleFactor: 1,
  });

  console.log("Navigating to app on http://localhost:3001...");
  await page.goto("http://localhost:3001", { waitUntil: "networkidle0" });

  // Inject animated virtual cursor
  await page.evaluate(() => {
    const cursor = document.createElement("div");
    cursor.id = "demo-cursor";
    cursor.style.position = "fixed";
    cursor.style.top = "0px";
    cursor.style.left = "0px";
    cursor.style.width = "24px";
    cursor.style.height = "24px";
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex = "999999";
    cursor.style.transform = "translate(600px, 300px)";
    cursor.style.transition = "transform 0.05s linear";
    cursor.innerHTML = `
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35));">
        <path d="M4.5 3.5L10.5 20.5L13.5 13.5L20.5 10.5L4.5 3.5Z" fill="#1e1b4b" stroke="#ffffff" stroke-width="1.8" stroke-linejoin="round"/>
      </svg>
      <div id="demo-click-pulse" style="
        position: absolute;
        top: 2px;
        left: 2px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.5);
        transform: scale(0);
        opacity: 0;
        transition: transform 0.25s ease-out, opacity 0.25s ease-out;
      "></div>
    `;
    document.body.appendChild(cursor);

    window.updateCursor = (x, y, click = false) => {
      const el = document.getElementById("demo-cursor");
      if (el) {
        el.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (click) {
        const pulse = document.getElementById("demo-click-pulse");
        if (pulse) {
          pulse.style.transform = "scale(2.2)";
          pulse.style.opacity = "1";
          setTimeout(() => {
            pulse.style.transform = "scale(0)";
            pulse.style.opacity = "0";
          }, 250);
        }
      }
    };
  });

  let frameCount = 0;
  let cursorX = 600;
  let cursorY = 200;

  async function captureFrame() {
    frameCount++;
    const num = String(frameCount).padStart(5, "0");
    const framePath = path.join(framesDir, `frame_${num}.png`);
    await page.screenshot({ path: framePath, type: "png" });
  }

  async function captureStill(durationMs, fps = 15) {
    const frames = Math.round((durationMs / 1000) * fps);
    const interval = durationMs / frames;
    for (let i = 0; i < frames; i++) {
      await captureFrame();
      await sleep(interval);
    }
  }

  async function moveCursor(targetX, targetY, durationMs, fps = 15) {
    const frames = Math.max(1, Math.round((durationMs / 1000) * fps));
    const startX = cursorX;
    const startY = cursorY;
    const interval = durationMs / frames;

    for (let i = 1; i <= frames; i++) {
      const t = i / frames;
      // Smooth easeInOutQuad
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      cursorX = Math.round(startX + (targetX - startX) * ease);
      cursorY = Math.round(startY + (targetY - startY) * ease);

      await page.evaluate(
        (x, y) => window.updateCursor(x, y, false),
        cursorX,
        cursorY,
      );
      await captureFrame();
      await sleep(interval);
    }
  }

  async function clickAt(x, y) {
    await page.evaluate((cx, cy) => window.updateCursor(cx, cy, true), x, y);
    await captureStill(250, 15);
  }

  console.log("Recording: Step 1 - Page initial load...");
  await captureStill(1500); // observe bouncing text and clean landing page

  console.log("Recording: Step 2 - Moving to Upload Button...");
  // Find upload button bounding box
  const selectButton = await page.$("button.border-indigo-500");
  const buttonBox = await selectButton.boundingBox();
  const targetX = Math.round(buttonBox.x + buttonBox.width / 2);
  const targetY = Math.round(buttonBox.y + buttonBox.height / 2);

  await moveCursor(targetX, targetY, 800);
  await clickAt(targetX, targetY);

  console.log("Recording: Step 3 - Uploading invoice image...");
  const fileInput = await page.$("input#file-upload");
  await fileInput.uploadFile(invoiceFile);

  // Wait for file item to appear in the list
  await page.waitForSelector("li.flex.items-center");
  await captureStill(1200);

  console.log("Recording: Step 4 - Moving to Transcribe Button...");
  // Find "Transcrire les factures" button
  const buttons = await page.$$("button");
  let transcribeButton = null;
  for (const b of buttons) {
    const text = await page.evaluate((el) => el.textContent, b);
    if (text?.includes("Transcrire les factures")) {
      transcribeButton = b;
      break;
    }
  }

  if (transcribeButton) {
    const transBox = await transcribeButton.boundingBox();
    const tX = Math.round(transBox.x + transBox.width / 2);
    const tY = Math.round(transBox.y + transBox.height / 2);

    await moveCursor(tX, tY, 800);
    await clickAt(tX, tY);
    await transcribeButton.click();
  }

  console.log(
    "Recording: Step 5 - Waiting for transcription loading and completion...",
  );
  // The transcribe API has ~1s delay, then results appear
  await page.waitForFunction(
    () => {
      return document.querySelector("pre") !== null;
    },
    { timeout: 10000 },
  );

  // Let result animation settle
  await captureStill(1000);

  console.log(
    "Recording: Step 6 - Inspecting transcribed JSON and Download button...",
  );
  // Move cursor towards the Download button to highlight it
  const downloadBtn = await page.$("a[download] button");
  if (downloadBtn) {
    const dlBox = await downloadBtn.boundingBox();
    await moveCursor(
      Math.round(dlBox.x + dlBox.width / 2),
      Math.round(dlBox.y + dlBox.height / 2),
      600,
    );
  }

  // Smooth scroll down slightly if needed to showcase JSON
  await page.evaluate(() => {
    window.scrollBy({ top: 120, behavior: "smooth" });
  });
  await captureStill(2500); // 2.5 seconds pause so viewers can read the extracted JSON

  console.log(`Total frames captured: ${frameCount}`);
  await browser.close();

  console.log("Encoding MP4 video with ffmpeg...");
  execSync(
    `ffmpeg -y -framerate 15 -i "${framesDir}/frame_%05d.png" -c:v libx264 -pix_fmt yuv420p -vf "scale=1100:-2:flags=lanczos" "${mp4Output}"`,
    { stdio: "inherit" },
  );

  console.log("Encoding GIF with palettegen...");
  execSync(
    `ffmpeg -y -framerate 15 -i "${framesDir}/frame_%05d.png" -vf "fps=15,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=256:reserve_transparent=0[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" "${gifOutput}"`,
    { stdio: "inherit" },
  );

  console.log("Cleaning temporary frames...");
  fs.rmSync(framesDir, { recursive: true, force: true });

  const gifStats = fs.statSync(gifOutput);
  const mp4Stats = fs.statSync(mp4Output);
  console.log(`\nDONE!`);
  console.log(
    `GIF: ${gifOutput} (${(gifStats.size / (1024 * 1024)).toFixed(2)} MB)`,
  );
  console.log(
    `MP4: ${mp4Output} (${(mp4Stats.size / (1024 * 1024)).toFixed(2)} MB)`,
  );
}

main().catch((err) => {
  console.error("Error during recording:", err);
  process.exit(1);
});
