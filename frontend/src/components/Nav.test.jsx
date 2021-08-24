import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import React from "react";
import "@testing-library/jest-dom";
import { Router } from "react-router";
import Nav from "./Nav";
import { UIStore } from "../data/store";

describe("Nav rendering", () => {
  const history = createMemoryHistory();
  test("should see introduction and login only", async () => {
    render(
      <Router history={history}>
        <Nav />
      </Router>
    );
    await waitFor(() => {
      expect(screen.getByText(/Introduction/i)).toBeInTheDocument();
      expect(screen.getByText(/Login/i)).toBeInTheDocument();
      expect(screen.queryByText("Data Map")).not.toBeInTheDocument();
    });
  });

  test("should see login text replaced by logout text", async () => {
    render(
      <Router history={history}>
        <Nav isAuthenticated />
      </Router>
    );
    await waitFor(() => {
      expect(screen.getByText(/Logout/i)).toBeInTheDocument();
      expect(screen.queryByText("Login")).not.toBeInTheDocument();
      expect(screen.queryByText("Data Map")).not.toBeInTheDocument();
    });
  });

  test("should see all menu authenticated except manage if user is active", async () => {
    UIStore.update((u) => {
      u.user = {
        active: true,
      };
    });
    render(
      <Router history={history}>
        <Nav isAuthenticated />
      </Router>
    );
    await waitFor(() => {
      const elements = screen.queryAllByRole("link");
      expect(Array.from(elements).map((el) => el.text)).toMatchObject([
        "Introduction",
        "Data Map",
        "Case",
        "Benchmarking",
        "Logout",
      ]);
      expect(screen.queryByText("Admin")).not.toBeInTheDocument();
    });
  });
});
