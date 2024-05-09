describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)

    const user = {
      name: 'sroot',
      username: 'sroot',
      password: 'salainen'
    }

    const user2 = {
      name: 'root',
      username: 'root',
      password: 'salainen'
    }

    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user2)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.get('#login-button')
  })

  it('front page can be opened', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('sroot')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains("sroot logged in")
    })

    it('fails with wrong credentials', function() {      //add notification during login process , if success and failure - DONE
      cy.get('#username').type('xxx')
      cy.get('#password').type('xxx')
      cy.get('#login-button').click()


      // cy.contains('invalid username or password')
      cy.get('.notification').should('contain', 'invalid username or password')
      cy.get('.notification').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.get('.notification').should('have.css', 'border-style', 'solid')
      //  cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
      //or
      //cy.contains('Matti Luukkainen logged in').should('not.exist')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'sroot', password: 'salainen' })
    })

    it('A blog can be created', function() {
      const blog = {
        title: 'test title',
        author: 'user',
        url: 'www.test.com',
      }

      cy.contains('Create blog').click()
      cy.get('#title').type(blog.title)
      cy.get('#author').type(blog.author)
      cy.get('#url').type(blog.url)
      cy.get('.blog-create-button').click()

      cy.get('.notification').should('contain', `Blog : ${blog.title} by ${blog.author} added`)
      cy.get('.notification').should('have.css', 'color', 'rgb(0, 128, 0)')
      cy.contains('test title user')
    })
  })

  describe('Created blog', function() {
    const blog = {
      title: 'test title blog',
      author: 'user',
      url: 'www.test.com',
    }
    const blog2 = {
      title: 'test title blog2',
      author: 'user',
      url: 'www.test.com',
    }

    beforeEach(function() {
      cy.login({ username: 'sroot', password: 'salainen' })
      cy.createBlog(blog)
    })

    it('can be liked', function() {
      cy.contains('View').click()
      cy.contains('Likes : 0')

      cy.contains('like').click()

      cy.get('.notification').should('contain', `A like for blog ${blog.title} by ${blog.author}`)
      cy.get('.notification').should('have.css', 'color', 'rgb(0, 128, 0)')
      cy.contains('Likes : 1')
    })

    it('can be deleted by the owner', function() {
      cy.contains('View').click()
      cy.contains('remove').click()
      cy.get('.notification').should('contain', `Blog ${blog.title} removed`)
      // cy.get('html').should('not.contain', `${blog.title}`) doesnt work
      // cy.contains(`${blog.title}`).should('not.exist')   doesnt work
    })

    it('can only be deleted by its creator', function() {
      cy.contains('logout').click()
      cy.login({ username: "root", password: 'salainen' })

      cy.contains('View').click()
      cy.contains('remove').should('not.exist')

      cy.contains('logout').click()
      cy.login({ username: "sroot", password: 'salainen' })

      cy.contains('View').click()
      cy.contains('remove').click()
            
    })
  })

  describe('when theres several blogs', function() {
    const blogs = [
      { title: 'blog0', author: 'Sal', url: 'www.sal.com'},
      { title: 'blog1', author: 'Murr', url: 'www.murr.com'},
      { title: 'blog2', author: 'Q', url: 'www.q.com'}
    ]

    beforeEach(function() {
      cy.login({ username: 'sroot', password: 'salainen' })
      cy.createBlog(blogs[0])
      cy.createBlog(blogs[1])
      cy.createBlog(blogs[2])
    })

    it.only('ordered by likes', function() {
      cy.contains(blogs[0].title).contains('View').click()
      cy.contains(blogs[0].title).contains('like').as('like0')
      cy.contains(blogs[1].title).contains('View').click()
      cy.contains(blogs[1].title).contains('like').as('like1')
      cy.contains(blogs[2].title).contains('View').click()
      cy.contains(blogs[2].title).contains('like').as('like2')

      //How to make cypress fking click the same button multiple time in succession?
      // ANSWER = Vite has very fast response time, we can click button multiple
      //time but only after long timeout (10sec), otherwise Cypress(in Vite) will
      //just skip the command and move on
      // cy.get('@like2').click({ multiple: true }) ---> multiple: true isnt necessart
      // cy.wait(4000)
      // cy.get('@like2').click({ multiple: true })


      cy.get('@like2').click()
      cy.wait(1000)
      cy.get('@like1').click()
      cy.wait(1000)
      cy.get('@like2').click()
      cy.wait(1000)

      cy.get('.Blog').eq(0).should('contain', blogs[2].title)
      cy.get('.Blog').eq(0).should('contain', 'Likes : 2')
      cy.get('.Blog').eq(1).should('contain', blogs[1].title)
      cy.get('.Blog').eq(1).should('contain', 'Likes : 1')
      cy.get('.Blog').eq(2).should('contain', blogs[0].title)
      cy.get('.Blog').eq(2).should('contain', 'Likes : 0')

      // this can be also done with a 'for' loop
      // Cypress._.times(3, function() {
      //   cy.get('@like2').click()
      //   cy.wait(1000)
      // })


    })
  })
 

})

//to start front end : npm run dev
//to start backend in test: npm run start:test 
//to start cypress : npm run cypress:open