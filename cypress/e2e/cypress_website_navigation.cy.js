describe('Cypress Website Tests', () => {
    const dropdownProductSelector = '[data-cy=dropdown-product]'
    const delightfulExperienceSelector = '[href="#delightful_experience"].whitespace-nowrap'

    beforeEach(() => {
        cy.visit('https://www.cypress.io/') // Visits the Cypress website at the start of each test
        cy.get('head title')
            .should('include.text', 'JavaScript Component Testing and E2E Testing Framework | Cypress') // Verifies the title of the page
    })

    it('should display the weekly downloads number', () => {
        cy.contains('Loved by OSS, trusted by Enterprise').scrollIntoView()
        cy.contains('div', 'Weekly downloads')
            .parent('.grow')
            .find('div.font-bold')
            .should('have.text', '5M+') // Verifies the downloads number is visible
    })

    it('should navigate to the About Cypress page', () => {
        cy.get('[data-cy=dropdown-company]').trigger('mouseover') // Mouseover on the Company link
        cy.get('a[href="https://github.com/cypress-io/cypress"]').should('be.visible')
        cy.contains('About Cypress').click()
        cy.get('.text-white.text-center').should('contain.text', 'About us')
    })

    it('should display the correct npm install command', () => {
        // Ensure the viewport width is set to at least 1024px for the install button to be displayed on the UI
        cy.get('[data-cy=header-install]').click()
        cy.get('[id=cy_modal_label]').should('contain.text', 'Installing Cypress')
        cy.contains('npm install cypress').click()
        cy.window().then((win) => {
            return win.navigator.clipboard.readText() // Return the Promise returned by readText
        }).then((text) => {
            // This function will be executed after the Promise returned by readText resolves
            expect(text).to.equal('npm install cypress --save-dev') // Verifies the copied text
        })
    })

    it('should navigate to the Visual Review page', () => {
        cy.get(dropdownProductSelector).trigger('mouseover')
        cy.contains('Test your modern applications with our open-source app').should('be.visible')
        cy.get(dropdownProductSelector).click()
        cy.url().should('include', '/app')
        cy.get('[href="#visual_debugging"].whitespace-nowrap').click()
        cy.url().should('include', 'app#visual_debugging')
    })

    it('should check the border color of an element before and after click', () => {
        cy.get(dropdownProductSelector).click()
        cy.url().should('include', '/app')
        cy.get(delightfulExperienceSelector).then(($el) => {
            const stylesBeforeClick = window.getComputedStyle($el[0])
            cy.log('Border-color before click: ' + stylesBeforeClick.borderColor)
            expect(stylesBeforeClick.borderColor).to.equal('rgba(0, 0, 0, 0)')
        })

        cy.get(delightfulExperienceSelector).click()

        cy.url().should('include', '/app#delightful_experience')
        cy.contains('Easy Installation').should('have.css', 'color', 'rgb(73, 86, 227)')
        cy.wait(1000)

        cy.get(delightfulExperienceSelector).then(($el) => {
            const stylesAfterClick = window.getComputedStyle($el[0])
            cy.log('Border-color after click: ' + stylesAfterClick.borderColor)
            expect(stylesAfterClick.borderColor).to.equal('rgb(163, 231, 203)')
        })
    })

})