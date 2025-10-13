 	const express = require('express');
 	const router = express.Router();
 	
 	let books = [
 	  {id: 1, title: 'Book 1', author: 'Author 1'},
 	  {id: 2, title: 'Book 2', author: 'Author 2'}
 	];
 	
 	router.get('/', (req, res) => {
        throw new Error('Ini adalah error yang disengaja!');
 	    res.json(books);
 	});
 	
 	router.get('/:id', (req, res) => {
 	  const book = books.find(b => b.id === parseInt(req.params.id));
 	  if (!book) return res.status(404).send('Book not found');
 	  res.json(book);
 	});
 	
 	router.post('/', (req, res) => {
 	  const { title, author } = req.body;
 	  if (!title || !author) {
 	      return res.status(400).json({ message: 'Title and author are required' });
 	  }
 	  const book = {
 	    id: books.length + 1,
 	    title,
 	    author
 	  };
 	  books.push(book);
 	  res.status(201).json(book);
 	});

    // PUT /api/books/:id (Untuk Update)
    router.put('/:id', (req, res) => {
        const bookId = parseInt(req.params.id);
        const { title, author } = req.body;
        const bookIndex = books.findIndex(b => b.id === bookId);

        if (bookIndex !== -1) {
            books[bookIndex] = { ...books[bookIndex], title, author };
            res.json(books[bookIndex]);
        } else {
            res.status(404).send('Book not found');
        }
    });
 	
    // DELETE /api/books/:id (Untuk Delete)
    router.delete('/:id', (req, res) => {
        const bookId = parseInt(req.params.id);
        const bookIndex = books.findIndex(b => b.id === bookId);

        if (bookIndex !== -1) {
            books.splice(bookIndex, 1);
            res.status(204).send(); // 204 No Content, artinya berhasil dihapus
        } 
        else {
        res.status(404).send('Book not found');
        }
    });

 	module.exports = router;