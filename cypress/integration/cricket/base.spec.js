/// <reference types="cypress" />
import { onlyOn, skipOn } from "@cypress/skip-test";

context("Cricket", () => {
    // setup users and save off localstorage
    before(() => {
        cy.visit("http://localhost:9000");

        // Add Users
        cy.get("a").contains("Players").click();

        cy.get("button").contains("Add Player").click();
        cy.get('[data-qa-label="name"]').type("Jonathon");
        cy.get("button").contains("Save changes").click();

        cy.get("button").contains("Add Player").click();
        cy.get('[data-qa-label="name"]').type("Morgan");
        cy.get("button").contains("Save changes").click();

        // Go back to home page
        cy.get("a").contains("Home").click();

        cy.saveLocalStorage();
    });

    // before each test, restore local storage
    beforeEach(() => {
        cy.visit("http://localhost:9000");

        cy.restoreLocalStorage();

        // Navigate to Cricket page
        cy.get("a").contains("Cricket").click();
    });

    it.skip("Bugfix #0005 - Bull Should Register Points", () => {
        //onlyOn(false);

        // Start a new game
        cy.contains("New Game").click();

        // Select players and create game
        cy.contains("Jonathon").click();
        cy.contains("Morgan").click();
        cy.contains("Save changes").click();

        cy.get('[data-qa-game-id="0"]').find("a").contains("Play Game").click();

        cy.get('[data-qa-segment="Double Bull"]').click();
        cy.get('[data-qa-segment="Double Bull"]').click();
        cy.get('[data-qa-segment="Double Bull"]').click();

        cy.get('[data-qa-score-for="Jonathon"]', { timeout: 0 }).should(
            ($score) => {
                expect($score.eq(0).text()).to.not.equal("0");
            }
        );

        // This bug would cause the app to throw and exception and crash here, which causes the test
        // to fail, which is why there are no specific exceptions.
    });

    it('Bugfix #0006 - Hitting the "Go to Previous Turn" Button Before Any Throws Should Not Crash the App', () => {
        // Start a new game
        cy.contains("New Game").click();

        // Select players and create game
        cy.contains("Jonathon").click();
        cy.contains("Morgan").click();
        cy.contains("Save changes").click();

        cy.get('[data-qa-game-id="0"]').find("a").contains("Play Game").click();

        cy.get("button").contains("Go To Previous Turn").should("be.disabled");
    });

    it("Bugfix #0007 - Points Are Not Scored for Segments 1-14", () => {
        // Start a new game
        cy.contains("New Game").click();

        // Select players and create game
        cy.contains("Jonathon").click();
        cy.contains("Morgan").click();
        cy.contains("Save changes").click();

        cy.get('[data-qa-game-id="0"]').find("a").contains("Play Game").click();

        cy.get('[data-qa-segment="Treble 14"]').click();
        cy.get('[data-qa-segment="Treble 14"]').click();
        cy.get('[data-qa-segment="Treble 14"]').click();

        cy.get('[data-qa-score-for="Jonathon"]', { timeout: 0 }).should(
            ($score) => {
                expect($score.eq(0).text()).to.equal("0");
            }
        );
    });

    it.skip("Bugfix #0008 - No Points Are Scored When Opponents Have that Number Closed Out", () => {
        // Start a new game
        cy.contains("New Game").click();

        // Select players and create game
        cy.contains("Jonathon").click();
        cy.contains("Morgan").click();
        cy.contains("Save changes").click();

        cy.get('[data-qa-game-id="0"]').find("a").contains("Play Game").click();

        cy.get('[data-qa-segment="Treble 18"]').click();
        cy.get("button").contains("Next Round").click();
        cy.get('[data-qa-segment="Treble 18"]').click();
        cy.get('[data-qa-segment="Treble 18"]').click();

        cy.get('[data-qa-score-for="Morgan"]', { timeout: 0 }).should(
            ($score) => {
                expect($score.eq(0).text()).to.equal("0");
            }
        );
    });
});
