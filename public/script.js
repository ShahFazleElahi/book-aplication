document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('book-list');
    const uploadForm = document.getElementById('upload-form');
    
    // Function to fetch and display books
    function fetchBooks() {
        fetch('/api/books')
            .then(response => response.json())
            .then(books => {
                bookList.innerHTML = '';
                books.forEach(book => {
                    const bookItem = document.createElement('div');
                    bookItem.classList.add('book-item');
                    bookItem.innerHTML = `
                        <h3>${book.title}</h3>
                        <a href="/uploads/${book.filename}" target="_blank">Read Book</a>
                    `;
                    bookList.appendChild(bookItem);
                });
            });
    }
    
    fetchBooks();

    // Handle book upload
    uploadForm.addEventListener('submit', event => {
        event.preventDefault();
        const formData = new FormData(uploadForm);
        
        fetch('/api/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Book uploaded successfully!');
                fetchBooks();  // Refresh the book list
            } else {
                alert('Upload failed.');
            }
        });
    });
});
