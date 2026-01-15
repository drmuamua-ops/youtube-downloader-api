const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'YouTube Downloader API is running' });
});

// Download endpoint
app.get('/download', async (req, res) => {
  const videoId = req.query.id;
  
  if (!videoId) {
    return res.status(400).json({ error: 'Video ID is required' });
  }

  try {
    const command = `./yt-dlp -f "best[height<=720]" --cookies cookies.txt --get-url "https://www.youtube.com/watch?v=${videoId}"`;
    
    const { stdout, stderr } = await execPromise(command, { timeout: 60000 });
    
    if (stderr && stderr.includes('ERROR')) {
      return res.status(500).json({ error: 'Failed to get video URL', details: stderr });
    }
    
    const url = stdout.trim();
    res.json({ success: true, url: url, videoId: videoId });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Download failed', 
      message: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

### PASO 3: Guarda los cambios

1. Baja hasta el final
2. En "Commit message" escribe: `Fix yt-dlp path`
3. Haz clic en **"Commit changes"**

---

### PASO 4: Render desplegará automáticamente

Render detectará el cambio y re-desplegará automáticamente en 2-3 minutos.

---

**Espera 3 minutos y luego prueba de nuevo:**
```
https://youtube-downloader-api-71b9.onrender.com/download?id=dQw4w9WgXcQ
