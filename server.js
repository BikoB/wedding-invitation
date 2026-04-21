const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "responses.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify({ responses: [] }, null, 2), "utf-8");
  }
}

async function readData() {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, "utf-8");
  const parsed = JSON.parse(raw);
  if (!parsed.responses || !Array.isArray(parsed.responses)) {
    return { responses: [] };
  }
  return parsed;
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

function normalizeName(name) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ");
}

app.get("/api/responses", async (req, res) => {
  try {
    const data = await readData();

    const coming = data.responses
      .filter((item) => item.status === "coming")
      .map((item) => item.fullName);
    const notComing = data.responses
      .filter((item) => item.status === "not_coming")
      .map((item) => item.fullName);

    res.json({ coming, notComing, total: data.responses.length });
  } catch (error) {
    res.status(500).json({ error: "Не удалось получить ответы." });
  }
});

app.post("/api/responses", async (req, res) => {
  try {
    const fullName = normalizeName(req.body.fullName);
    const status = req.body.status;

    if (!fullName) {
      return res.status(400).json({ error: "Укажите логин." });
    }

    if (!["coming", "not_coming"].includes(status)) {
      return res.status(400).json({ error: "Неверный вариант ответа." });
    }

    const data = await readData();
    const index = data.responses.findIndex(
      (item) => item.fullName.toLowerCase() === fullName.toLowerCase()
    );

    const entry = {
      fullName,
      status,
      updatedAt: new Date().toISOString()
    };

    if (index === -1) {
      data.responses.push(entry);
    } else {
      data.responses[index] = entry;
    }

    await writeData(data);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Не удалось сохранить ответ." });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
