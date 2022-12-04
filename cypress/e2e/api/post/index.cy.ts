/// <reference types="cypress" />

import axios from "axios";
import config from "../../../../utils/config";

// import axios from "axios";
// import prisma from "prisma";
// import config from "../../../../utils/config";
// import { ONE_HOUR } from "../../../../utils/time";
// import jwt from "jsonwebtoken";
// import setAuthorization from "../../../../utils/api/auth/setAuthorization";

describe("Post API testing", () => {
 context("GET - /api/post/", () => {
  it("Should render a list of posts", () => {
   cy.request("/api/post").should((response) => {
    expect(response.body).length.to.be.gt(0);
   });
  });
  it("Should have the author property", () => {
   cy.request("/api/post").should((response) => {
    expect(response.body[0].author.userId).not.to.be.undefined;
    expect(response.body[0].author.password).to.be.undefined;
    expect(response.body[0].author.likedBy).to.be.undefined;
   });
  });
 });

 context("POST - /api/post/", () => {
  it("Should create a post", async () => {
   const token = await axios.post(`${config.BASE_URL}/api/token/generate`);

   cy
    .request({
     url: `${config.BASE_URL}/api/post`,
     body: {
      title: "Lorem",
      description: "Lorem ipsum",
     },
     method: "POST",
     headers: {
      authorization: `Bearer ${token.data}`,
     },
    })
    .should((res) => {
     expect(res.status).to.be.eq(200);
    });
  });

  context("Not logged in", () => {
   it("Should return status 401", () => {
    cy
     .request({
      url: `${config.BASE_URL}/api/post`,
      body: {
       title: "Lorem",
       description: "Lorem ipsum",
      },
      method: "POST",
      headers: {},
      failOnStatusCode: false,
     })
     .should((res) => {
      expect(res.status).to.be.eq(401);
     });
   });

   it("Should have a 'Not authorized' body", () => {
    cy
     .request({
      url: `${config.BASE_URL}/api/post`,
      body: {
       title: "Lorem",
       description: "Lorem ipsum",
      },
      method: "POST",
      headers: {},
      failOnStatusCode: false,
     })
     .should((res) => {
      expect(res.body).to.be.deep.equal({ error: "Not authorized" });
     });
   });
  });

  context("Bad token", () => {
   it("Should return status 437", () => {
    cy
     .request({
      method: "POST",
      url: `${config.BASE_URL}/api/token/generate`,
     })
     .should((res) => {
      cy
       .request({
        url: `${config.BASE_URL}/api/post`,
        body: {
         title: "Lorem",
         description: "Lorem ipsum",
        },
        method: "POST",
        headers: {
         authorization: res.body,
        },
        failOnStatusCode: false,
       })
       .should((res) => {
        expect(res.status).to.be.eq(437);
       });
     });
   });
  });

  context("Token expired", () => {
   it("Should return status 410", () => {
    cy
     .request({
      method: "POST",
      url: `${config.BASE_URL}/api/token/expired`,
     })
     .should((res) => {
      cy
       .request({
        url: `${config.BASE_URL}/api/post`,
        body: {
         title: "Lorem",
         description: "Lorem ipsum",
        },
        method: "POST",
        headers: {
         authorization: `Bearer ${res.body}`,
        },
        failOnStatusCode: false,
       })
       .should((res) => {
        expect(res.status).to.be.eq(410);
       });
     });
   });
  });
 });
});

export {};
