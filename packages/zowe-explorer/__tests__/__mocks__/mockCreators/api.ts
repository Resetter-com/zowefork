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

import { imperative, MainframeInteraction } from "@zowe/zowe-explorer-api";
import { ZoweExplorerApiRegister } from "../../../src/extending/ZoweExplorerApiRegister";

export function createJesApi(profile: imperative.IProfileLoaded) {
    return ZoweExplorerApiRegister.getJesApi(profile);
}
export function bindJesApi(api: MainframeInteraction.IJes) {
    const getJesApiMock = jest.fn();
    getJesApiMock.mockReturnValue(api);
    ZoweExplorerApiRegister.getJesApi = getJesApiMock.bind(ZoweExplorerApiRegister);
}

export function createMvsApi(profile: imperative.IProfileLoaded) {
    return ZoweExplorerApiRegister.getMvsApi(profile);
}
export function bindMvsApi(api: MainframeInteraction.IMvs) {
    const getMvsApiMock = jest.fn();
    getMvsApiMock.mockReturnValue(api);
    ZoweExplorerApiRegister.getMvsApi = getMvsApiMock.bind(ZoweExplorerApiRegister);
}

export function createUssApi(profile: imperative.IProfileLoaded) {
    return ZoweExplorerApiRegister.getUssApi(profile);
}
export function bindUssApi(api: MainframeInteraction.IUss) {
    const getUssApiMock = jest.fn();
    getUssApiMock.mockReturnValue(api);
    ZoweExplorerApiRegister.getUssApi = getUssApiMock.bind(ZoweExplorerApiRegister);
}

export function createCommandApi(profile: imperative.IProfileLoaded) {
    return ZoweExplorerApiRegister.getCommandApi(profile);
}
export function bindCommandApi(api: MainframeInteraction.IJes) {
    const getCommandApiMock = jest.fn();
    getCommandApiMock.mockReturnValue(api);
    ZoweExplorerApiRegister.getCommandApi = getCommandApiMock.bind(ZoweExplorerApiRegister);
}
