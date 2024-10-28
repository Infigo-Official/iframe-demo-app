# 🌟 Infigo API Iframe Integration

## 📖 Overview

Welcome to the Infigo API Iframe Integration project! This integration bridges our merchant system and the Infigo platform, streamlining product and order management. With this setup, you can enjoy seamless communication between systems, enabling efficient order placement, product retrieval, and timely status updates.

For more detailed information, dive into our documentation at the [Infigo Wiki](https://wiki-iframe.private.infigosoftware.rocks/).

## ⚙️ Requirements

- **Node.js Version**: Ensure you are using **Node.js v14 or later** for optimal performance.

## 🗂️ Project Structure

This project is thoughtfully organized into several key directories, each serving a distinct purpose to enhance your development experience:

### 🖥️ **ui**
The **`ui`** directory houses our vibrant Vue.js application, the heart of the user interface. Here, users can seamlessly interact with the Infigo platform, manage their orders, and explore product offerings. This dynamic front-end is designed for optimal user experience and responsiveness.

### 🔗 **backend**
In the **`backend`** directory, you'll find a lightweight proxy and webhook collector. This component acts as a bridge, managing callback URLs for output creation. It ensures smooth communication between our Vue.js app and the Infigo API, providing a robust backend experience.

### 📦 **resources**
The **`resources`** directory contains a sample JavaScript file that demonstrates how to set variables for inventory management and product attributes within Infigo. This resource serves as a handy reference, guiding you through the configuration process to integrate seamlessly with the Infigo system.

### 🛠️ **build**
The **`build`** directory is your go-to for Docker configurations and scripts, enabling effortless deployment of the project in a containerized environment. This setup simplifies the build process and ensures consistency across different environments.

## 🚀 Getting Started

### 1. Setup

To kick off your journey with the Infigo API integration, follow these steps:

- Ensure you have an Infigo customer who is making the request.
- Gather the product details to determine which editor and product to load.
- Make an API call to request a link to load the editor.

The URL provided by the API can be embedded dynamically within your iframe source. When this URL is clicked, it will log the customer in and load the relevant editor and product.

### 2. 📡 JavaScript Communicator Library

To capture events such as **'Add to Basket'** or **'Save as Project'**, include our JavaScript communicator library on your page hosting the iframe. This allows you to react to these events and act accordingly.

### 3. 🛒 Placing Orders

Once the user has finished editing, you can place an order or create an output through the API. This step finalizes the process, ensuring that user selections are effectively captured and processed.

---

You can view a deployed version of this application at [Infigo API Demo App](https://demo-iframe-api.private.infigosoftware.rocks/).
