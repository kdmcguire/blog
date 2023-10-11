---
title: "Cookies, Browsers, and Misplaced Efforts"
publishDate: "7 August 2021"
description: "We deserve better than privacy through gritted teeth."
tags: ["web", "privacy"]
---

## What is this?

This is an opinionated venting on the state of the web at the moment. I might come back to the topic later if I find something specific I want to research and reference, but for now, it's just my feelings and experience as an internet user. It is also very much **my** opinion.

### A rant

We deserve better than privacy through gritted teeth.

First let me say that the GDPR legislation appears to be a significant improvement for user rights and I've not (yet) found a reason to doubt that the intentions behind it were anything but good. I do not want it to be undone, and I am an advocate for individual privacy and agency. And sure, this is a relatively trivial complaint compared to the huge advancement that is GDPR, but it's one that doesn't seem to be going away and will probably only get worse.

I can't help but feel that the way this guidance has been implemented has added friction and annoyances to the web. I also can't help but suspect that _that_ is often intentional.

Most sites I visit (on my mobile) show me a pop-up that ask whether I want to let them place all the cookies they want in my browser, or whether I just want to allow a sub-set of those cookies through, or none.

No site really wants us to say "None, please," but they have to give us the option. And no user really wants to be tracked across the internet, because why would we? But sometimes we say "OK" because it's the easier way to get it over with.

Other, less proactive (and less compliant) sites will just show you a banner telling you that by being here, you've accepted the cookies. It's too late!

Earlier, I said "on my mobile", because on my desktop computer is much improved, hassle-free experience with Firefox and a few extensions. Browsing the internet is less annoying there. See the end of the post for a list of [my Firefox settings and extensions](https://kieran-mcguire.uk/posts/cookies-browsers-and-misplaced-efforts/#my-firefox-setup) that make it a nice way to surf the 'net!

No more cookie banners. No more pop-ups asking me for granular consent. Mostly importantly, no unwanted cookies or tracking. And, so far, nothing's broken.

**This is the way the web should be.**

Rather than being asked by _every single site_, the standard approach should be that we give our browser our preferences so they can do the repetetive work for us. The browser should enforce those settings wherever we go, and sites should expect to be told what they can and can't do.

If this sounds familiar, it's because it is. The do-not-track setting already exists as a browser standard, but most sites ignore it because it has no legal standing and they want to track you.

As a compromise, the do-not-track setting needs to be overhauled to meet sites halfway. I should be able to tell my browser that I never want to be tracked across multiple sites by tools that build up a profile of me, but if a site wants to use a contained tool to see how I interact with them, _and them only_, then I'll allow it.

But after that, the browser should proactively assert those settings and control what it lets in. It's **our** browser, not theirs.

### My Firefox setup

- The Strict mode of the built-in [Enhanced Tracking Protection](https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop) settings, protecting me from "Social media trackers, Cross-site cookies in all windows (includes tracking cookies), Tracking content in all windows, Cryptominers, Fingerprinters"
- Built-in [Site Isolation](https://blog.mozilla.org/security/2021/05/18/introducing-site-isolation-in-firefox/), loading each site you visit into a separate operating system process so that one site can't access your private data for another site
- The [U-block Origin](https://addons.mozilla.org/en-GB/firefox/addon/ublock-origin/) extension, with most of the filter lists enabled
- The [Privacy Badger](https://addons.mozilla.org/en-GB/firefox/addon/privacy-badger17/) extension
- And, lastly, because all of the above protect me so well, the [I don't care about cookies](https://addons.mozilla.org/en-GB/firefox/addon/i-dont-care-about-cookies/) extension.
