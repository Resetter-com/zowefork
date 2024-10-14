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

import * as zosjobs from "@zowe/zos-jobs-for-zowe-sdk";
import { Profiles } from "../../../src/configuration/Profiles";
import { createIProfile, createISessionWithoutCredentials } from "../../__mocks__/mockCreators/shared";
import { SpoolUtils } from "../../../src/utils/SpoolUtils";
import { createJobSessionNode } from "../../__mocks__/mockCreators/jobs";
import { bindJesApi, createJesApi } from "../../__mocks__/mockCreators/api";

describe("SpoolProvider Unit Tests", () => {
    const iJobFile: zosjobs.IJobFile = {
        "byte-count": 128,
        "job-correlator": "",
        "record-count": 1,
        "records-url": "fake/records",
        class: "A",
        ddname: "STDOUT",
        id: 100,
        jobid: "100",
        jobname: "TESTJOB",
        lrecl: 80,
        procstep: "",
        recfm: "FB",
        stepname: "",
        subsystem: "",
    };
    const profilesForValidation = { status: "active", name: "fake" };

    Object.defineProperty(Profiles, "getInstance", {
        value: jest.fn(() => {
            return {
                allProfiles: [{ name: "firstName" }, { name: "secondName" }],
                defaultProfile: { name: "firstName" },
                checkCurrentProfile: jest.fn(() => {
                    return profilesForValidation;
                }),
                profilesForValidation: [],
                validateProfiles: jest.fn(),
            };
        }),
    });
    Object.defineProperty(Profiles, "getDefaultProfile", {
        value: jest.fn(() => {
            return {
                name: "firstName",
            };
        }),
    });
    Object.defineProperty(Profiles, "loadNamedProfile", {
        value: jest.fn(() => {
            return {
                name: "firstName",
            };
        }),
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe("matchSpool", () => {
        it("should match spool to the selected node", () => {
            const spool: zosjobs.IJobFile = { ...iJobFile };
            let match = SpoolUtils.matchSpool(spool, { spool } as any);
            expect(match).toBe(true);

            // Different job id
            match = SpoolUtils.matchSpool(spool, { spool: { ...spool, jobid: "101" } } as any);
            expect(match).toBe(false);

            // Different spool id
            match = SpoolUtils.matchSpool(spool, { spool: { ...spool, id: 101 } } as any);
            expect(match).toBe(false);

            // Missing spool property
            match = SpoolUtils.matchSpool(spool, { label: "missingSpool" } as any);
            expect(match).toBe(false);
        });
    });

    describe("getSpoolFiles", () => {
        afterEach(() => {
            jest.restoreAllMocks();
        });

        it("should gather all spool files for a given job", async () => {
            const profile = createIProfile();
            const session = createISessionWithoutCredentials();
            const newJobSession = createJobSessionNode(session, profile);

            const jesApi = createJesApi(profile);
            bindJesApi(jesApi);

            const spoolOk: zosjobs.IJobFile = { ...iJobFile, stepname: "test", ddname: "dd", "record-count": 1, procstep: "proc" };
            const withoutIdDdStep: Partial<zosjobs.IJobFile> = JSON.parse(JSON.stringify(spoolOk));
            delete withoutIdDdStep.id;
            delete withoutIdDdStep.ddname;
            delete withoutIdDdStep.stepname;

            newJobSession.job = spoolOk as any;

            const getSpoolFilesSpy = jest.spyOn(jesApi, "getSpoolFiles").mockResolvedValue([spoolOk, withoutIdDdStep] as any);

            const spools = await SpoolUtils.getSpoolFiles(newJobSession);

            expect(getSpoolFilesSpy).toHaveBeenCalledWith("TESTJOB", "100");
            expect(spools).toEqual([spoolOk]);
        });

        it("should return an empty array of the node.job is null", async () => {
            const profile = createIProfile();
            const session = createISessionWithoutCredentials();
            const newJobSession = createJobSessionNode(session, profile);

            const jesApi = createJesApi(profile);
            bindJesApi(jesApi);

            const spools = await SpoolUtils.getSpoolFiles(newJobSession);

            expect(spools).toEqual([]);
        });
    });
});
