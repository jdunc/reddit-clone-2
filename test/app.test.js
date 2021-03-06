describe('App', () => {
  beforeEach(() => {
    browser.get('/');
  });

  it('toggles the form', () => {
    new PostForm()
      .expectFormToBeClosed()
      .clickNewPostButton()
      .expectFormToBeOpen()
      .clickNewPostButton()
      .expectFormToBeClosed();
  });

  it('disables the button until the form is valid', () => {
    new PostForm()
      .clickNewPostButton()
      .expectButtonToBeDisabled()
      .fillIn()
      .expectButtonToBeEnabled();
  });

  it('changes the validation class names on blur', () => {
    new PostForm()
      .clickNewPostButton()
      .expectClassesToChangeOnBlur();
  });

  it('creates a post', () => {
    new PostForm()
      .clickNewPostButton()
      .fillIn()
      .clickCreatePostButton()
      .expectPostToBeAdded();
  });

  it('allows users to add comments', () => {
    new PostForm()
      .clickNewPostButton()
      .fillIn()
      .clickCreatePostButton()
      .expandComments()
      .addComment('firsties')
      .expectCommentToBePresent('firsties');
  });

  it('clicking on comments only expands a single comments field (not all of them)', () => {
    const firstPost = new PostForm()
      .clickNewPostButton()
      .fillIn()
      .clickCreatePostButton();

    const secondPost = new PostForm('My other title', 'My other text', 'Some Other Author', 'http://example.com/bar')
      .clickNewPostButton()
      .fillIn()
      .clickCreatePostButton();

    firstPost
      .expectCommentsToBeCollapsed()
      .expandComments()
      .expectCommentsToBeExpanded();

    secondPost
      .expectCommentsToBeCollapsed()
      .expandComments()
      .expectCommentsToBeExpanded();
  });

  it('allows users to filter', () => {
    const firstPost = new PostForm('To be')
      .clickNewPostButton()
      .fillIn()
      .clickCreatePostButton();

    const secondPost = new PostForm('Or not to be', 'My other text', 'Some Other Author', 'http://example.com/bar')
      .clickNewPostButton()
      .fillIn()
      .clickCreatePostButton();

    const filterer = new Filterer().filterBy('to be');

    firstPost.expectToBePresent();
    secondPost.expectToBePresent();

    filterer.filterBy('not');
    firstPost.expectToNotBePresent();
    secondPost.expectToBePresent();
  });

  it('allows users to sort', () => {
    const firstPost = new PostForm('Zebras rock')
      .clickNewPostButton()
      .fillIn()
      .clickCreatePostButton();

    const secondPost = new PostForm('Anteaters Rock')
      .clickNewPostButton()
      .fillIn()
      .clickCreatePostButton();

    new Sorter()
      .expectSortByVotesToShow()
      .clickOnSortByTitle();
  });

  class Filterer {
    constructor() {
      this.filterField = element(by.css('input[placeholder=Filter]'));
    }

    filterBy(input) {
      this.filterField.clear();
      this.filterField.sendKeys(input);
      return this;
    }
  }

  class Sorter {
    constructor() {
      this.sortByVotesHeader = element(by.cssContainingText('a', 'Sort By Votes'));

      this.sortByTitle = element(by.cssContainingText('a', 'Title'));
    }

    clickOnSortByTitle() {
      this.sortByVotesHeader.click();
      this.sortByTitle.click();
      return this;
    }

    expectSortByVotesToShow() {
      expect(this.sortByVotesHeader.isDisplayed()).toEqual(true);
      return this;
    }
  }

  class PostForm {
    constructor(title = 'My Post Title', body = 'My Post Body', author = 'Some Author', imageUrl = 'http://example.com/foo') {
      this.title = title;
      this.body = body;
      this.author = author;
      this.imageUrl = imageUrl;
      this.titleField = element(by.cssContainingText('form div,form p', 'Title')).element(by.css('input'));
      this.bodyField = element(by.cssContainingText('form div,form p', 'Body')).element(by.css('textarea'));
      this.authorField = element(by.cssContainingText('form div,form p', 'Author')).element(by.css('input'));
      this.imageUrlField = element(by.cssContainingText('form div,form p', 'Image URL')).element(by.css('input'));
      this.newPostButton = element(by.cssContainingText('a,button', 'New Post'));
      this.createPostButton = element(by.cssContainingText('input,button', 'Create Post'));
      this.postElement = element(by.cssContainingText('div[ng-repeat]', this.title));
      this.postElements = element.all(by.cssContainingText('div[ng-repeat]', this.title));
    }

    clickNewPostButton() {
      this.newPostButton.click();
      return this;
    }

    clickCreatePostButton() {
      this.createPostButton.click();
      return this;
    }

    fillIn() {
      this.titleField.sendKeys(this.title);
      this.bodyField.sendKeys(this.body);
      this.authorField.sendKeys(this.author);
      this.imageUrlField.sendKeys(this.imageUrl);
      return this;
    }

    expandComments() {
      this.postElement.element(by.cssContainingText('a', '0 Comments')).click();
      return this;
    }

    addComment(content) {
      this.postElement.all(by.css('input')).first().sendKeys(content);
      this.postElement.element(by.css('button, input[type=submit]')).click();
      return this;
    }

    expectFormToBeClosed() {
      expect(element.all(by.css('form')).count()).toEqual(0);
      return this;
    }

    expectToBePresent() {
      expect(this.postElements.count()).toBeGreaterThan(0);
      return this;
    }

    expectToNotBePresent() {
      expect(this.postElements.count()).toEqual(0);
      return this;
    }

    expectFormToBeOpen() {
      expect(element.all(by.css('form')).count()).toEqual(1);
      return this;
    }

    expectButtonToBeEnabled() {
      expect(this.createPostButton.getAttribute('disabled')).toEqual(null);
      return this;
    }

    expectButtonToBeDisabled() {
      expect(this.createPostButton.getAttribute('disabled')).toEqual('true');
      return this;
    }

    expectClassesToChangeOnBlur() {
      [this.titleField, this.bodyField, this.authorField, this.imageUrlField].forEach((el) => {
        const cssClass = el.getAttribute('class');
        browser.executeScript('arguments[0].focus(); arguments[0].blur()', el);
        expect(el.getAttribute('class')).not.toEqual(cssClass);
      });
      return this;
    }

    expectPostToBeAdded() {
      expect(this.postElement.element(by.css('img')).getAttribute('src')).toEqual(this.imageUrl);
      expect(this.postElement.getText()).toMatch(this.title);
      expect(this.postElement.getText()).toMatch(this.body);
      expect(this.postElement.getText()).toMatch(this.author);
      expect(this.postElement.getText()).toMatch(/0 Comments/);
      return this;
    }

    expectCommentToBePresent(content) {
      expect(this.postElement.getText()).toContain(content);
      expect(this.postElement.all(by.css('input')).first().getAttribute('value')).toEqual('');
      return this;
    }

    expectCommentsToBeCollapsed() {
      expect(this.postElement.all(by.css('input')).count()).toEqual(0);
      return this;
    }

    expectCommentsToBeExpanded() {
      expect(this.postElement.all(by.css('input')).count()).toBeGreaterThan(0);
      return this;
    }
  }
});
