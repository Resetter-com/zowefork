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

import * as imperative from "@zowe/imperative";

export namespace Login {
    export function apimlLogin(session: imperative.Session) {
        return "APIMLToken";
    }
}

export namespace Logout {
    export function apimlLogout(session: imperative.Session) {
        return;
    }
}

export class ProfileConstants {
    public BaseProfile = {
        type: "base",
    };
}
