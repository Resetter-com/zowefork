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

import { DsEntry, PdsEntry, FsDatasetsUtils } from "../../../../src";

describe("isDsEntry", () => {
    it("returns true if value is a DsEntry", () => {
        const entry = new DsEntry("TEST.DS", false);
        expect(FsDatasetsUtils.isDsEntry(entry)).toBe(true);
    });

    it("returns false if value is not a DsEntry", () => {
        const pds = new PdsEntry("TEST.PDS");
        expect(FsDatasetsUtils.isDsEntry(pds)).toBe(false);
    });
});

describe("isMemberEntry", () => {
    it("returns true if value is a PDS member", () => {
        const entry = new DsEntry("TEST", true);
        expect(FsDatasetsUtils.isMemberEntry(entry)).toBe(true);
    });

    it("returns false if value is not a PDS member", () => {
        const entry = new DsEntry("TEST.PS", false);
        expect(FsDatasetsUtils.isMemberEntry(entry)).toBe(false);
    });
});

describe("isPdsEntry", () => {
    it("returns true if value is a PdsEntry", () => {
        const spoolEntry = new PdsEntry("TESTJOB.TEST.SPOOL.JES");
        expect(FsDatasetsUtils.isPdsEntry(spoolEntry)).toBe(true);
    });

    it("returns false if value is not a PdsEntry", () => {
        const ds = new DsEntry("TEST.DS", false);
        expect(FsDatasetsUtils.isPdsEntry(ds)).toBe(false);
    });
});
