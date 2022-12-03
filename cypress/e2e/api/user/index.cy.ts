/// <reference types="cypress" />

import config from "../../../../utils/config";

describe("User API testing", () => {
 context("GET - /api/user/", () => {
  it("Should render a list of users", () => {
   cy.request("/api/user").should((response) => {
    expect(response.body).length.to.be.gt(0);
    console.log(Object.keys(response.body[0]));
   });
  });

  it("Should have the post property", () => {
   cy.request("/api/user").should((response) => {
    assert.isArray(response.body[0].posts);
    expect(response.body[0].posts[0].author).to.be.undefined;
   });
  });

  context("With Authorization header", () => {
   it("Should return an user object", () => {
    cy
     .request({
      method: "POST",
      url: `${config.BASE_URL}/api/token/generate`,
      body: { userId: "63837ea6b982b46d52053118" },
     })
     .should((res) => {
      cy
       .request({
        url: `${config.BASE_URL}/api/user`,
        method: "GET",
        failOnStatusCode: false,
        headers: {
         authorization: `Bearer ${res.body}`,
        },
       })
       .should((res) => {
        expect(res.status).to.be.eq(200);
       });
     });
   });
  });
 });

 context("POST - /api/user/", () => {
  // it("Should create an user", () => {
  //  cy
  //   .request({
  //    url: `${config.BASE_URL}/api/user`,
  //    body: {
  //     username: "Baptiste",
  //     email: "baptiste.braun.123@gmail.com",
  //     password: Buffer.from("iloveu").toString("base64"),
  //    },
  //    method: "POST",
  //    failOnStatusCode: false,
  //   })
  //   .should((res) => {
  //    expect(res.status).to.be.eq(200);
  //   });
  // });

  context("User already exists", () => {
   it("Should return status 409", () => {
    cy
     .request({
      url: `${config.BASE_URL}/api/user`,
      body: {
       username: "Baptiste",
       email: "baptiste.braun.123@gmail.com",
       password: Buffer.from("iloveu").toString("base64"),
      },
      method: "POST",
      failOnStatusCode: false,
     })
     .should((res) => {
      expect(res.status).to.be.eq(409);
     });
   });
  });
 });
});

export {};
