/// <reference types="cypress" />

describe("Posts API testing", () => {
 context("GET - /api/post/", () => {
  it("Should render a list of posts", () => {
   cy.request("/api/post").should((response) => {
    expect(response.body).length.to.be.gt(0);
    console.log(Object.keys(response.body[0]));
   });
  });
  it("Should have the author property", () => {
   cy.request("/api/post").should((response) => {
    expect(response.body[0].author.userId).not.to.be.undefined;
    // expect(response.body[0].author.password).to.be.undefined;
    expect(response.body[0].author.likedBy).to.be.undefined;
   });
  });
 });
});

export {};
