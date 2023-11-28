import icons from 'url:../../../img/icons.svg'; //Parcel 2
import View from '../View';

class previewView extends View {
  _parentElement = '';

  _generateMarkup() {
    const id = window.location.hash.slice(1);

    return `   <li class="preview">
    <a class="preview__link ${
      +id === this._data.id ? 'preview__link--active' : ''
    }" href="#${this._data.id}">
      <figure class="preview__fig">
        <img src="${this._data.image}" alt="Test" />
      </figure>
      <div class="preview__data">
        <div class="preview__data__text">
          <h4 class="preview__title">${this._data.title}</h4>
       
          <span class="calories ${this._data.calories ? '' : 'display-none'}">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="#000000"
            viewBox="0 0 256 256"
          >
            <path
              d="M173.79,51.48a221.25,221.25,0,0,0-41.67-34.34,8,8,0,0,0-8.24,0A221.25,221.25,0,0,0,82.21,51.48C54.59,80.48,40,112.47,40,144a88,88,0,0,0,176,0C216,112.47,201.41,80.48,173.79,51.48ZM96,184c0-27.67,22.53-47.28,32-54.3,9.48,7,32,26.63,32,54.3a32,32,0,0,1-64,0Zm77.27,15.93A47.8,47.8,0,0,0,176,184c0-44-42.09-69.79-43.88-70.86a8,8,0,0,0-8.24,0C122.09,114.21,80,140,80,184a47.8,47.8,0,0,0,2.73,15.93A71.88,71.88,0,0,1,56,144c0-34.41,20.4-63.15,37.52-81.19A216.21,216.21,0,0,1,128,33.54a215.77,215.77,0,0,1,34.48,29.27C193.49,95.5,200,125,200,144A71.88,71.88,0,0,1,173.27,199.93Z"
            ></path>
          </svg>
          <strong >${this._data.calories}</strong>
          Calories
        </span>
        <div class="preview__data__text__tags">
          <span class="tag tag--protein ${
            this._data.proteins ? '' : 'display-none'
          }">${this._data.proteins}g Proteins</span>
          <span class="tag tag--carbs ${
            this._data.carbs ? '' : 'display-none'
          }">${this._data.carbs}g Carbs</span>
          <span class="tag tag--fats  ${
            this._data.fats ? '' : 'display-none'
          }">${this._data.fats}g Fats</span>
        </div>
        </div>
        <div class="recipe__user-generated ${
          this._data.key ? '' : 'display-none'
        }">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
       </div>
       <p class="preview__publisher">
       ${
         this._data.publisher
           ? this._data.publisher
           : this._data.bookmarked
           ? this._data.bookmarked
           : ''
       }    
       </p>
      </div>
    </a>
</li>`;
  }
}
export default new previewView();
