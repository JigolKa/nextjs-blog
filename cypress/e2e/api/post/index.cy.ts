/// <reference types="cypress" />

describe("Posts API testing", () => {
 context("GET - /api/posts/", () => {
  it("Should have at least one post", () => {
   cy.request("/api/post").should((response) => {
    expect(response.status).to.eq(200);
    assert.isArray(response.body);
   });
  });
 });
});

export {};
