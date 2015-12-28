module.exports = angular.module('books.list.authorsListController', [
  require('components/createAuthor').name
])
    .controller('authorListController', authorListController);

function authorListController (authorService, $http, modalService) {
    const vm = this;

    vm.hidden = true;
    vm.authorsList = authorService.authorsList();

    vm.showBooks = function (authorId) {
      return $http.get('/api/books/' + authorId).then( function (res) {
          var authorName = res.data[0].author_id.name;
          var bookList = Object.keys(res.data).map(function (key) {return res.data[key].title}).join('<br/>');

          var modalOptions = {
              closeButtonText: 'Close',
              actionButtonText: '',
              headerText: authorName + "'s Books",
              displayAction: false,
              bodyText: bookList
          };

          modalService.showModal(modalOptions);
      });
    }

}
