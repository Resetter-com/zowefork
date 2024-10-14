/**
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import { Given, Then, When } from "@cucumber/cucumber";
import { TreeItem } from "wdio-vscode-service";
import { Key } from "webdriverio";
import { getZoweExplorerContainer, paneDivForTree } from "../../../../__common__/shared.wdio";
import quickPick from "../../../../__pageobjects__/QuickPick";

//
// Scenario: User clicks on the "Zowe Explorer" icon in the Activity Bar
//
When("a user locates the Zowe Explorer icon in the side bar", async () => {
    const zeContainer = await getZoweExplorerContainer();
    await expect(zeContainer).toBeDefined();
});
Then("the user can click on the Zowe Explorer icon", async () => {
    const zeContainer = await getZoweExplorerContainer();
    await expect(await zeContainer.openView()).toBeDefined();
});

//
// Scenario: User collapses/expands the Favorites node
//
Given("a user who is looking at the Zowe Explorer tree views", async function () {
    const zeContainer = await getZoweExplorerContainer();
    this.zeView = await zeContainer.openView();
    await expect(this.zeView).toBeDefined();
    await expect(this.zeView.elem).toBeDisplayedInViewport();
});
When(/a user (.*) the Favorites node in the (.*) view/, async (state: string, tree: string) => {
    const pane = await paneDivForTree(tree);
    const shouldExpand = state == "expands";

    if (!(await pane.isExpanded()) && shouldExpand) {
        await pane.expand();
    }

    const favoritesItem = (await pane.findItem("Favorites")) as TreeItem;
    await expect(favoritesItem).toBeDefined();
    if (shouldExpand) {
        await favoritesItem.expand();
    } else {
        await favoritesItem.collapse();
    }
});
Then(/the Favorites node (.*) successfully in the (.*) view/, async (state: string, tree: string) => {
    const expandedState = (state !== "collapses").toString();

    const pane = await paneDivForTree(tree);
    const favoritesItem = (await pane.findItem("Favorites")) as TreeItem;
    const expandedAttr = await (await favoritesItem.elem).getAttribute("aria-expanded");
    await expect(expandedAttr).toBe(expandedState);
});

//
// Scenario: User clicks on the plus button to open the "Add Config/Profile" quick pick
//
When(/a user clicks the plus button in the (.*) view/, async (tree: string) => {
    const pane = await paneDivForTree(tree);
    if (!(await pane.isExpanded())) {
        await pane.expand();
    }
    await pane.elem.moveTo();

    const plusIcon = await pane.getAction(`Add Profile to ${tree} View`);
    await expect(plusIcon).toBeDefined();
    await expect(plusIcon.elem).toBeClickable();
    await plusIcon.elem.click();
});
Then("the Add Config quick pick menu appears", async () => {
    await browser.waitUntil(() => quickPick.isDisplayed());

    // dismiss the quick pick after verifying that it is visible
    await browser.keys(Key.Escape);
    await browser.waitUntil(async () => !(await quickPick.isDisplayed()));
});

//
// Scenario: User clicks on the context menu and hides a tree view
//
When(/a user hides the (.*) view using the context menu/, async (tree: string) => {
    const activityBar = (await browser.getWorkbench()).getActivityBar();
    const zeContainer = await activityBar.getViewControl("Zowe Explorer");
    const zeView = await zeContainer.openView();
    const zeTitlePart = zeView.getTitlePart();
    const ctxMenu = await zeTitlePart.openContextMenu();
    const menuItem = await ctxMenu.getItem(tree);
    await (await menuItem.elem).click();
});
Then(/the (.*) view is no longer displayed/, async (tree: string) => {
    const activityBar = (await browser.getWorkbench()).getActivityBar();
    const zeContainer = await activityBar.getViewControl("Zowe Explorer");
    const zeView = await zeContainer.openView();
    const sidebarContent = zeView.getContent();
    const visibleSections = await sidebarContent.getSections();
    expect(visibleSections.find(async (s) => (await s.getTitle()) === tree)).not.toBeDisplayedInViewport();

    // re-enable the view for the next test scenario
    const zeTitlePart = zeView.getTitlePart();
    const ctxMenu = await zeTitlePart.openContextMenu();
    const menuItem = await ctxMenu.getItem(tree);
    await (await menuItem.elem).click();
    await ctxMenu.close();
});

// This step may fail if the VS Code version that's used for testing has an issue with tree item selection.
// If this test fails and the VS Code version does not have any known issues with tree item selection, then this
// indicates a potential issue problem in one of Zowe Explorer's tree views.
Then("a user can select multiple nodes in a tree view", async function () {
    const pane = await paneDivForTree("data sets");
    const treeItems = await pane.getVisibleItems();
    for (const treeItem of treeItems) {
        await browser.keys(Key.Shift);
        await treeItem.select();
    }
    await expect(treeItems.every(async (treeItem) => (await treeItem.elem.getAttribute("aria-selected")) === "true")).toBe(true);
});
