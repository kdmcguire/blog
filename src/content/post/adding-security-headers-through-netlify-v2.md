---
title: "Adding Security Headers Through Netlify v2"
publishDate: "15 June 2023"
description: "Refining my security headers setup with Netlify... again."
tags: ["web", "security"]
---

Coming back to this topic years later, since moving from Hugo to Astro, I decided to redo this post rather than overhaul the old one in-place.

Here's my **updated** security headers configuration in `netlify.toml`:

```toml
[[headers]]
for = "/*"
  [headers.values]
    Content-Security-Policy = "default-src 'self' 'unsafe-inline'"
    Permissions-Policy = "accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=(), clipboard-read=(), clipboard-write=(), gamepad=(), speaker-selection=(), conversion-measurement=(), focus-without-user-activation=(), hid=(), idle-detection=(), interest-cohort=(), serial=(), sync-script=(), trust-token-redemption=(), unload=(), vertical-scroll=()"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=63072000; includeSubDomains; preload"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

I won't go into every line, but I will explain the few things I tweaked.

## Cache-Control

I removed this part entirely because I'm happy with Netlify's default caching for static files - `public, max-age=0, must-revalidate`. The `max-age=0` looks like it won't be cached, but `must-revalidate` tells the browser to check the `etag` attribute's value, which only changes when the site is redeployed. Effectively, the user's browser will reuse the cached file until a fresh deploy changes the `etag`, at which point it goes for the latest version.

## Content-Security-Policy

Unfortunately we still need to add `'unsafe-inline'` for `script-src` and `style-src` because Eleventy prefers to inline css and js for faster performance.

## Permissions-Policy

I added this long list because I explicitly want to tell the browser that I do not ever want to ask the user for any of this information. I don't need it, I don't want it!

Fortunately, with Eleventy, I no longer need to do the `'unsafe-inline'` in `script-src` or `style-src`, so I removed those parts.

## Resources

As all ways, these docs and Scott Helme's expertise are a vital resource.

- <https://docs.netlify.com/routing/headers/>
- <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control>
- <https://securityheaders.com/>
- <https://scotthelme.co.uk/content-security-policy-an-introduction/>
- <https://scotthelme.co.uk/goodbye-feature-policy-and-hello-permissions-policy/>
- <https://scotthelme.co.uk/a-new-security-header-referrer-policy/>
