require('angular');
require('angular-ui-router');
require('angular-ui-bootstrap');
require('angular-slugify');

import ROUTES from './constants/routes';
import STATES from './constants/states';

const app = angular.module('books', [
    'ui.router',
    'ui.bootstrap',
    'slugifier',
    require('./services/book-service').name,
    require('./components/books/list').name,
    require('./components/books/info').name,
    require('./components/authors/list').name,
    require('./components/navigation').name,
    require('./components/authors/authorsSelect').name,
    require('./components/authors/edit').name,
    require('./components/authors/info').name,
    require('./services/author-service').name,
    require('./services/modal-service').name,
    require('./components/shared/rating').name

]);
app.config(setUpRoutes);

function setUpRoutes ($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider
        .state(STATES.BOOKS_LIST, {
            url: ROUTES.BOOKS,
            template: require('./components/books/list/template.html'),
            controller: 'bookListController',
            controllerAs: 'vm',
            resolve: {
                books: function ($http, bookService) {
                    return $http.get('/api/authorbooks').then( function (res) {
                        bookService.initBooks(res.data);
                    });
                },
                authors: function ($http, authorService) {
                    return $http.get('/api/authors').then( function (res) {
                        authorService.initAuthors(res.data);
                    });
                }
            }
        })
        .state(STATES.BOOK_INFO, {
            url: ROUTES.BOOK_INFO,
            template: require('./components/books/info/template.html'),
            controller: 'bookInfoController',
            controllerAs: 'vm',
            params: {
              bookSlug: '',
              bookId: ''
            },
            resolve: {
                bookData: function ($http, $stateParams) {
                    return $http.get('/api/books/' + $stateParams.bookId).then( function (res) {
                      return res.data[0];
                    });
                }
            }
        })
        .state(STATES.BOOK_CREATE, {
            url: ROUTES.BOOK_CREATE,
            template: require('./components/books/bookCreate/template.html'),
            controller: 'bookCreateController',
            controllerAs: 'vm'
        })
        .state(STATES.AUTHORS_LIST, {
            url: ROUTES.AUTHORS,
            template: require('./components/authors/list/template.html'),
            controller: 'authorListController',
            controllerAs: 'vm',
            resolve: {
                authors: function ($http, authorService) {
                    return $http.get('/api/authors').then( function (res) {
                        authorService.initAuthors(res.data);
                    });
                }
            }
        })
        .state(STATES.AUTHOR_EDIT, {
            url: ROUTES.AUTHOR_EDIT,
            template: require('./components/authors/edit/template.html'),
            controller: 'authorEditController',
            controllerAs: 'vm',
            resolve: {
                authors: function ($http, authorService, $stateParams) {
                    return $http.get('/api/authors/' + $stateParams.authorId).then( function (res) {
                        authorService.initAuthors(res.data[0]);
                    });
                }
            }
        })
        .state(STATES.AUTHOR_INFO, {
            url: ROUTES.AUTHOR_INFO,
            params: {
              authorSlug: '',
              authorId: ''
            },
            template: require('./components/authors/info/template.html'),
            controller: 'authorInfoController',
            controllerAs: 'vm',
            resolve: {
                authorData: function ($http, $stateParams) {
                    return $http.get('/api/authorbooks/' + $stateParams.authorId).then( function (res) {
                      return res.data;
                    });
                }
            }
        })
        .state('index', {
            url: '/',
            template: 'Hello'
        });
}
