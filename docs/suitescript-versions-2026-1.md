# SuiteScript 1.0 vs 2.0 vs 2.1 in NetSuite 2026.1

## Scope

This note summarizes the official Oracle NetSuite documentation for the differences between **SuiteScript 1.0**, **SuiteScript 2.0**, and **SuiteScript 2.1**, with emphasis on which script types can run under each version in **NetSuite 2026.1**.

Only Oracle/NetSuite-owned documentation is referenced.

Source review status: adversarial source check performed on **2026-06-12**. Claims stated as Oracle documentation are based on linked Oracle sources. Claims labeled as recommendations or inferences are this note's synthesis from those sources.

## Executive summary

SuiteScript 1.0 is still supported, but Oracle says it is no longer updated and should not be used for new or majorly updated scripts; Oracle recommends SuiteScript 2.0 or 2.1 for new work. [Source: SuiteScript 2.x Advantages](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4284471744.html)

SuiteScript 2.x is a redesign of SuiteScript 1.0 and generally supports all SuiteScript 1.0 functionality, but Oracle says there is not always a direct one-to-one mapping between SuiteScript 1.0 functions/objects and SuiteScript 2.x modules/methods. [Source: Overview of the Differences Between SuiteScript 1.0 and SuiteScript 2.x](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098615298.html)

SuiteScript 2.1 is the latest SuiteScript version and can be used for server and client scripts; Oracle states that server-side SuiteScript 2.1 uses the Graal runtime engine and supports ECMAScript 2023. [Source: SuiteScript 2.1](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_156042690639.html)

SuiteScript 2.0 and 2.1 mostly use the same SuiteScript API, but Oracle documents runtime and behavior differences between them, including ECMAScript support differences and modules that are only available in SuiteScript 2.1. [Source: Differences Between SuiteScript 2.0 and SuiteScript 2.1](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_158755248128.html)

In NetSuite 2026.1, Oracle introduced a new company preference that lets compatible SuiteScript 2.0 **server scripts** run in a SuiteScript 2.1 runtime environment. [Source: NetSuite 2026.1 SuiteScript release note](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_N3949604.html)

## Version differences

| Area | SuiteScript 1.0 | SuiteScript 2.0 | SuiteScript 2.1 |
|---|---|---|---|
| Current status | Supported, but no longer updated. Oracle recommends SuiteScript 2.x for new or major updates. [Source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4284471744.html) | Documented SuiteScript 2.x version. Oracle says `@NApiVersion 2.x` resolves to 2.0 by default when uploaded and executed. [Source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_156632003699.html) | Latest SuiteScript version. [Source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_156042690639.html) |
| Programming model | SuiteScript 1.0 functions and objects; Oracle says these do not always map directly to SuiteScript 2.x modules and methods. [Source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098615298.html) | Modular API model with defined entry points, context objects, JSDoc annotations, and module loading. [Source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098615298.html) | Same SuiteScript API model as 2.0 in most cases, with newer JavaScript/runtime support and some behavior differences. [Source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_158755248128.html) |
| JavaScript / ECMAScript support | Not characterized by the cited sources. | Oracle describes SuiteScript 2.0 as based on ECMAScript 5.1. [Source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_156042690639.html) | Oracle states that server-side SuiteScript 2.1 uses the Graal runtime and supports ECMAScript 2023. [Source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_156042690639.html) |
| API support | SuiteScript 1.0 functions and objects, not always directly mapped to SuiteScript 2.x modules. [Source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098615298.html) | SuiteScript 2.x API. | Oracle says the SuiteScript API is the same for 2.0 and 2.1 with exceptions, including `N/llm` and `N/pgp`. [Source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_156042690639.html) |
| 2.1-only modules / features | Not applicable. | Not available. | Oracle says `N/llm`, `N/pgp`, and server-side `N/crypto/random` are only supported in SuiteScript 2.1. [Source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_158755248128.html) |

## NetSuite 2026.1 runtime behavior

Oracle introduced a new 2026.1 preference named **Execute SuiteScript 2.0 Server Scripts as 2.1**, which runs compatible SuiteScript 2.0 server scripts in the SuiteScript 2.1 runtime. [Source: NetSuite 2026.1 SuiteScript release note](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_N3949604.html)

Only SuiteScript 2.0 server scripts recognized as compatible with SuiteScript 2.1 are affected by this preference. [Source: NetSuite 2026.1 SuiteScript release note](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_N3949604.html)

If a SuiteScript 2.0 server script validates successfully with the preference enabled, Oracle recommends considering updating the script annotation to SuiteScript 2.1 to benefit from the 2.1 runtime. [Source: NetSuite 2026.1 SuiteScript release note](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_N3949604.html)

If a SuiteScript 2.0 server script does not validate successfully with the 2026.1 preference enabled, Oracle says it continues to run as SuiteScript 2.0. [Source: NetSuite 2026.1 SuiteScript release note](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_N3949604.html)

Script records with **Execute As = 2.0** continue to run as SuiteScript 2.0. [Source: NetSuite 2026.1 SuiteScript release note](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_N3949604.html)

Oracle separately documents account-level preferences for running scripts annotated as `@NApiVersion 2.x` or `@NApiVersion 2.0` as SuiteScript 2.1 without changing the script file. [Source: Enabling SuiteScript 2.1 at the Account Level](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_157960966997.html)

Oracle warns that account-level 2.1 execution preferences only affect script types supported by SuiteScript 2.1. [Source: Enabling SuiteScript 2.1 at the Account Level](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_157960966997.html)

Oracle also warns that if a script is annotated as `@NApiVersion 2.x`, syntax is validated as SuiteScript 2.0 even when the account-level preference runs it as SuiteScript 2.1; to use SuiteScript 2.1-only syntax, Oracle says to explicitly update the annotation to `@NApiVersion 2.1`. [Source: Enabling SuiteScript 2.1 at the Account Level](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_157960966997.html)

## Script type compatibility

Oracle says SuiteScript 2.x includes all SuiteScript 1.0 script types and adds two more script types: **Map/Reduce** and **SDF Installation**. [Source: Differences Between SuiteScript 1.0 and SuiteScript 2.x Script Types](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098628783.html)

Oracle’s current SuiteScript 2.x script type documentation also lists **SuiteScript 2.1 Custom Tool Script Type** as a script type. [Source: SuiteScript 2.x Script Types](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4387172495.html)

For SuiteScript 2.1, Oracle directly says SuiteScript 2.1 can be used for server and client scripts, but also warns that account-level 2.1 execution preferences affect only script types supported by SuiteScript 2.1. Where the table says "Yes by inference," the basis is Oracle's general 2.1 server/client support plus the current SuiteScript 2.x script type index, not a separate Oracle page explicitly stating that exact script type/version pair. [2.1 source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_156042690639.html), [account-level preference source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_157960966997.html), [2.x type source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4387172495.html)

| Script type | SuiteScript 1.0 | SuiteScript 2.0 | SuiteScript 2.1 | Notes / official basis |
|---|---:|---:|---:|---|
| Bundle Installation | Yes | Yes | Yes by inference | Oracle says SuiteScript 2.x includes all 1.0 script types, and the 2.x script type index lists Bundle Installation as a server script type. [1.0 → 2.x source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098628783.html), [2.x type source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4387172495.html) |
| Client Script | Yes | Yes | Yes, with caveats | Oracle lists Client Script as a 2.x script type, and says 2.1 can be used for client scripts. Oracle also documents 2.1 client-script caveats. [2.x type source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4387172495.html), [2.1 source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_156042690639.html) |
| Custom Tool | Not established by cited docs | Not established by cited docs | Yes | Oracle lists this as **SuiteScript 2.1 Custom Tool Script Type** in the current SuiteScript 2.x script type index. [Source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4387172495.html) |
| Map/Reduce | No | Yes | Yes by inference | Oracle says Map/Reduce is a new SuiteScript 2.x script type with no SuiteScript 1.0 equivalent, and the current 2.x script type index lists it as a server script type. [1.0 → 2.x source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098628783.html), [2.x type source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4387172495.html) |
| Mass Update | Yes | Yes | Yes by inference | Oracle says SuiteScript 2.x includes all 1.0 script types, and the 2.x script type index lists Mass Update as a server script type. [1.0 → 2.x source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098628783.html), [2.x type source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4387172495.html) |
| Portlet | Yes | Yes | Yes by inference | Oracle says SuiteScript 2.x includes all 1.0 script types, and the 2.x script type index lists Portlet as a server-rendered script type. [1.0 → 2.x source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098628783.html), [2.x type source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4387172495.html) |
| RESTlet | Yes | Yes | Yes by inference | Oracle says SuiteScript 2.x includes all 1.0 script types, and the 2.x script type index lists RESTlet as a server script type. [1.0 → 2.x source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098628783.html), [2.x type source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4387172495.html) |
| Scheduled Script | Yes | Yes | Yes by inference | Oracle says SuiteScript 2.x includes all 1.0 script types, and the 2.x script type index lists Scheduled Script as a server script type. [1.0 → 2.x source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098628783.html), [2.x type source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4387172495.html) |
| SDF Installation | No | Yes | Yes by inference | Oracle says SDF Installation is a new SuiteScript 2.x script type with no SuiteScript 1.0 equivalent, and the current 2.x script type index lists it. [1.0 → 2.x source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098628783.html), [2.x type source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4387172495.html) |
| Suitelet | Yes | Yes | Yes by inference | Oracle says SuiteScript 2.x includes all 1.0 script types, and the 2.x script type index lists Suitelet as a server script type. [1.0 → 2.x source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098628783.html), [2.x type source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4387172495.html) |
| User Event | Yes | Yes | Yes by inference | Oracle says SuiteScript 2.x includes all 1.0 script types, and the 2.x script type index lists User Event as a server script type. [1.0 → 2.x source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098628783.html), [2.x type source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4387172495.html) |
| Workflow Action | Yes | Yes | Yes by inference | Oracle says SuiteScript 2.x includes all 1.0 script types, and the 2.x script type index lists Workflow Action as a server script type. [1.0 → 2.x source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098628783.html), [2.x type source](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4387172495.html) |

## Important exceptions and caveats

SuiteScript 2.1 client scripts are not currently supported in **Scriptable Cart**. [Source: SuiteScript 2.1](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_156042690639.html)

SuiteTax does not support SuiteScript 2.1; Oracle says SuiteTax requires SuiteScript 2.0 for full functionality. [Source: SuiteScript 2.1](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_156042690639.html)

Some SuiteScript 2.1 features are not fully supported in client scripts, especially for subrecords; Oracle recommends using ES5.1-compatible features when needed in those contexts. [Source: SuiteScript 2.1](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_156042690639.html)

The 2026.1 preference for running SuiteScript 2.0 server scripts as SuiteScript 2.1 should be treated as a compatibility-testing mechanism, not a full migration, because Oracle still recommends updating the script annotation to SuiteScript 2.1 when you want to use 2.1 syntax and features. [Source: Enabling SuiteScript 2.1 at the Account Level](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_157960966997.html)

## Practical recommendation

This note's recommendation: for new development in NetSuite 2026.1, consider SuiteScript 2.1 by default unless the script must run in a documented exception area such as SuiteTax or Scriptable Cart. This recommendation is an inference from Oracle’s statement that SuiteScript 2.1 is the latest version and can be used for server and client scripts, combined with Oracle’s documented exceptions for SuiteTax and Scriptable Cart. [Source: SuiteScript 2.1](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_156042690639.html)

For existing SuiteScript 2.0 server scripts, use the 2026.1 account-level preference to test runtime compatibility, but explicitly migrate the script annotation to `@NApiVersion 2.1` when the script should rely on 2.1 syntax, behavior, or 2.1-only modules. [Source: Enabling SuiteScript 2.1 at the Account Level](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_157960966997.html)

For SuiteScript 1.0 scripts, treat them as legacy-maintenance-only because Oracle says SuiteScript 1.0 is still supported but no longer updated. [Source: SuiteScript 2.x Advantages](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4284471744.html)

## Reviewed source index

- [SuiteScript 2.x Advantages](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_4284471744.html)
- [Overview of the Differences Between SuiteScript 1.0 and SuiteScript 2.x](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098615298.html)
- [Differences Between SuiteScript 1.0 and SuiteScript 2.x Script Types](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/article_160098628783.html)
- [SuiteScript 2.x Script Types](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_4387172495.html)
- [SuiteScript 2.1](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/chapter_156042690639.html)
- [Differences Between SuiteScript 2.0 and SuiteScript 2.1](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_158755248128.html)
- [Running Scripts Using SuiteScript 2.1](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_156632003699.html)
- [Enabling SuiteScript 2.1 at the Account Level](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_157960966997.html)
- [NetSuite 2026.1 SuiteScript release note](https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_N3949604.html)
