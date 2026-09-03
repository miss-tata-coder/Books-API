const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

// Load books from JSON file
let books = JSON.parse(fs.readFileSync('books.json'));

// GET /books → all books (with optional filter)
app.get('/books', (req, res) => {
  const { author } = req.query;
  if (author) {
    const filtered = books.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
    return res.json(filtered);
  }
  res.json(books);
});

// GET /books/:id → single book
app.get('/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: "Book not found" });
  res.json(book);
});

// POST /books → create book with validation
app.post('/books', (req, res) => {
  const { title, author } = req.body;
  if (!title || !author || title.trim() === "" || author.trim() === "") {
    return res.status(400).json({ error: "Title and author are required" });
  }
  const newBook = { id: books.length + 1, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// DELETE /books/:id → remove book
app.delete('/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === id);
  if (index === -1) return res.status(404).json({ error: "Book not found" });
  const deleted = books.splice(index, 1);
  res.json(deleted[0]);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Books API running on port ${PORT}`));
