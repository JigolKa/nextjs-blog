/// <reference types="cypress" />

describe("Authentication system testing", () => {
 context("Basic authentication", () => {
  it("Should return a JWT", () => {
   cy
    .request({
     method: "POST",
     url: "/api/user/auth",
     body: {
      login: Buffer.from("noam.alrifai@protonmail.com").toString("base64"),
      password: Buffer.from("yPfPYw2hZvEiP46#").toString("base64"),
     },
    })
    .should((res) => {
     expect(res.status).to.be.eq(200);
     expect(res.body.split(".").length).to.be.eq(3);
    });
  });
 });

 context("Logins not encrypted", () => {
  it("Should return status 400", () => {
   cy
    .request({
     method: "POST",
     url: "/api/user/auth",
     body: {
      login: "noam.alrifai@protonmail.com",
      password: "yPfPYw2hZvEiP46#",
     },
     failOnStatusCode: false,
    })
    .should((res) => {
     expect(res.status).to.be.eq(400);
     expect(res.body.error).to.be.eq("Fields not encrypted");
    });
  });
 });

 context("Bad password", () => {
  it("Should return status 403", () => {
   cy
    .request({
     method: "POST",
     url: "/api/user/auth",
     body: {
      login: Buffer.from("noam.alrifai@protonmail.com").toString("base64"),
      password: Buffer.from("yPfPYw2hZvEiP46").toString("base64"),
     },
     failOnStatusCode: false,
    })
    .should((res) => {
     expect(res.status).to.be.eq(403);
     expect(res.body.error).to.be.eq("Bad password");
    });
  });
 });

 context("User doesn't exists", () => {
  it("Should return status 404", () => {
   cy
    .request({
     method: "POST",
     url: "/api/user/auth",
     body: {
      login: Buffer.from("noam.alrifai@e.com").toString("base64"),
      password: Buffer.from("olol").toString("base64"),
     },
     failOnStatusCode: false,
    })
    .should((res) => {
     expect(res.status).to.be.eq(404);
     expect(res.body.error).to.be.eq("User doesn't exists");
    });
  });
 });

 context("Requests coolodwn after 5 failed attempts", () => {
  it("Should set a cooldown after 5 requests", () => {
   cy.request({
    method: "DELETE",
    url: "/api/user/auth",
   });

   for (let i = 0; i <= 4; i++) {
    cy.request({
     method: "POST",
     url: "/api/user/auth",
     body: {
      login: Buffer.from("noam.alrifai@protonmail.com").toString("base64"),
      password: Buffer.from("yPfPYw2hZvEiP46").toString("base64"),
     },
     failOnStatusCode: false,
    });
   }

   cy
    .request({
     method: "POST",
     url: "/api/user/auth",
     body: {
      login: Buffer.from("noam.alrifai@protonmail.com").toString("base64"),
      password: Buffer.from("yPfPYw2hZvEiP46").toString("base64"),
     },
     failOnStatusCode: false,
    })
    .should((res) => {
     expect(res.status).to.be.eq(429);
     expect(res.body.error).includes("Request timeout:");
    });
  });
 });
});

export {};
