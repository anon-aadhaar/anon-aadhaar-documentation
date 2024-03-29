/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: "doc",
      id: "intro",
    },
    {
      type: "doc",
      id: "how-does-it-work",
    },
    {
      type: "doc",
      id: "quick-setup",
    },
    {
      type: "doc",
      id: "install-solidity-verifier",
    },
    {
      type: "category",
      label: "Guides",
      items: [
        {
          type: "doc",
          id: "proof",
        },
        {
          type: "doc",
          id: "signal",
        },
        {
          type: "doc",
          id: "nullifiers",
        },
      ],
    },
    {
      type: "doc",
      id: "generate-seed",
    },
    {
      type: "doc",
      id: "generate-qr",
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

module.exports = sidebars;
