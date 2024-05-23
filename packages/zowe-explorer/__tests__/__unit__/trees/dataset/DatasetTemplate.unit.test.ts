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

import { Types } from "@zowe/zowe-explorer-api";
import * as vscode from "vscode";
import { Constants } from "../../../../src/configuration/Constants";
import { DataSetTemplates } from "../../../../src/trees/dataset/DatasetTemplates";
import { ZoweLogger } from "../../../../src/tools/ZoweLogger";
import { SettingsConfig } from "../../../../src/configuration/SettingsConfig";

jest.mock("vscode");
jest.mock("fs");

describe("DataSetTemplates Class Unit Tests", () => {
    const templates: Types.DataSetAllocTemplate[] = [];
    const template1 = {
        mockTemplate1: {
            alcunit: "CYL",
            blksize: 3130,
            dirblk: 35,
            dsorg: "PO",
            lrecl: 40,
            primary: 1,
            recfm: "FB",
        },
    };
    const template2 = {
        mockTemplate2: {
            alcunit: "CYL",
            blksize: 6160,
            dirblk: 5,
            dsorg: "PO",
            primary: 1,
            recfm: "FB",
            lrecl: 80,
        },
    };
    templates.push(...[template1, template2]);
    const setValueSpy = jest.spyOn(SettingsConfig, "setDirectValue");
    const getValueSpy = jest.spyOn(SettingsConfig, "getDirectValue");
    const traceLoggerSpy = jest.spyOn(ZoweLogger, "trace");
    const infoLoggerSpy = jest.spyOn(ZoweLogger, "info");

    beforeEach(() => jest.resetAllMocks());

    describe("getDsTemplates()", () => {
        it("should retrieve the available dataset templates", () => {
            getValueSpy.mockReturnValue(templates);
            const response = DataSetTemplates.getDsTemplates();
            expect(response).toEqual(templates);
            expect(traceLoggerSpy).toHaveBeenCalledWith("Getting data set templates.");
        });
    });
    describe("resetDsTemplateSetting()", () => {
        it("should reset dataset templates to empty array", async () => {
            await DataSetTemplates.resetDsTemplateSetting();
            expect(traceLoggerSpy).toHaveBeenCalledWith("Resetting data set templates array.");
            expect(setValueSpy).toHaveBeenCalled();
        });
    });
    describe("updateDsTemplateSetting()", () => {
        it("should update data set templates", async () => {
            await DataSetTemplates.updateDsTemplateSetting(templates);
            expect(traceLoggerSpy).toHaveBeenCalledWith("Updating data set templates.");
            expect(setValueSpy).toHaveBeenCalledWith(Constants.SETTINGS_DS_TEMPLATES, templates);
        });
    });
    describe("addDsTemplateSetting()", () => {
        it("should add a dataset template if the criteria exists", async () => {
            getValueSpy.mockReturnValue([template2]);
            await DataSetTemplates.addDsTemplateSetting(template1 as any);
            expect(infoLoggerSpy).toHaveBeenCalled();
            expect(setValueSpy).toHaveBeenCalledWith(Constants.SETTINGS_DS_TEMPLATES, templates);
        });
    });
});
