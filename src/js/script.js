class BooksList {
  constructor() {
    this.data = [];
    this.favoriteBooks = [];
    this.filters = [];
    this.bookTemplate = Handlebars.compile(document.getElementById('template-book').innerHTML);
    this.booksList = document.querySelector('.books-list');
    this.bookFilters = document.querySelector('.filters');
  }

  initData() {
    this.data = dataSource.books;
  }

  render() {
    this.booksList.innerHTML = '';
    this.data.forEach(book => {
      const ratingWidth = book.rating * 10;
      const ratingBgc = this.determineRatingBgc(book.rating);


      const bookData = {
        ...book,
        ratingWidth: ratingWidth,
        ratingBgc: ratingBgc
      };
      const bookHTML = this.bookTemplate(bookData);
      const bookElement = document.createElement('li');
      bookElement.innerHTML = bookHTML.trim();
      this.booksList.appendChild(bookElement);
    });
    this.initActions();
  }

  initActions() {
    this.booksList.addEventListener('click', (event) => {
      if (event.target.classList.contains('book__image')) {
        event.preventDefault();

        const bookImage = event.target;
        const bookId = bookImage.getAttribute('data-id');

        if (this.favoriteBooks.includes(bookId)) {
          this.favoriteBooks = this.favoriteBooks.filter(id => id !== bookId);
          bookImage.classList.remove('favorite');
        } else {
          this.favoriteBooks.push(bookId);
          bookImage.classList.add('favorite');
        }
      }
    });


    this.bookFilters.addEventListener('click', (event) => {
      const clickedEl = event.target;

      if (clickedEl.type === 'checkbox' && clickedEl.name === 'filter' && clickedEl.tagName === 'INPUT') {
        if (clickedEl.checked) {
          this.filters.push(clickedEl.value);
        } else {
          const filterNumber = this.filters.indexOf(clickedEl.value);
          if (filterNumber !== -1) {
            this.filters.splice(filterNumber, 1);
          }
        }
      }
      console.log(this.filters);
      this.filterBooks();
    });
  }

  filterBooks() {
    this.data.forEach(book => {
      let shouldBeHidden = false;
      for (let filter of this.filters) {
        if (filter === 'adults' && !book.details.adults) {
          shouldBeHidden = true;
          break;
        }
        if (filter === 'nonFiction' && !book.details.nonFiction) {
          shouldBeHidden = true;
          break;
        }
      }

      const bookElement = this.booksList.querySelector(`.book__image[data-id="${book.id}"]`);
      if (shouldBeHidden) {
        bookElement.classList.add('hidden');
      } else {
        bookElement.classList.remove('hidden');
      }
    });
  }

  determineRatingBgc(rating) {
    let ratingBgc = '';
    if (rating < 6) {
      ratingBgc = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
    } else if (rating <= 8) {
      ratingBgc = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    } else if (rating <= 9) {
      ratingBgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    } else {
      ratingBgc = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }

    return ratingBgc;
  }
}


const app = new BooksList();
document.addEventListener('DOMContentLoaded', () => {
  app.initData();
  app.render();
});
