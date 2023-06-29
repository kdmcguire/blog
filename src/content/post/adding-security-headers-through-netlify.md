---
title: "Adding Security Headers Through Netlify"
publishDate: "3 July 2021"
description: "How do you get a Hugo site to set better security headers? With netlify.toml!"
tags: ["web", "security"]
---

The good news is there's nothing particularly unique or difficult about this.

Before I started digging into it, I was a bit confused about how this would work. Posts and pages are written in markdown, and there's no front-matter for security headers in my templates.

Fortunately, you can do this with either Hugo (in `hugo.toml`) or Netlify (in `netlify.toml`), and both methods are pretty similar.

Since I already had some production-specific configuration in my `netlify.toml`, I decided to do this with Netlify.

Here's my security headers configuration in `netlify.toml`:

```toml
[context.production.environment]
HUGO_VERSION = "0.83.1"
HUGO_ENV = "production"
HUGO_ENABLEGITINFO = "true"
[[headers]]
  for = "/*"
  [headers.values]
    Cache-Control = '''
    max-age=300,
    must-revalidate'''
    Content-Security-Policy = "default-src https://kieran-mcguire.uk https://kieran-mcguire.netlify.app; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    Permissions-Policy = "geolocation=(), microphone=()"
    Referrer-Policy = "strict-origin-when-cross-origin"
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

I won't go into every line, but I will explain the few things I tweaked.

## Cache-Control

```toml
Cache-Control = '''
max-age=300,
must-revalidate'''
```

This chunk sets a maximum cache age of 300 seconds, and tells the browser that it shouldn't serve stale content past that time if it can't refresh it from the source. I am on the fence about that last part. Maybe it would be better for the user to be able to keep seeing their cached version if they can't reach my site to refresh? Maybe I don't want them see stale content without realising it? I feel like this is a bit of a judgement call you could go either way on.

(I don't quite know why Netlify want this formatting, but they do, so here it is.)

## Permissions-Policy

```toml
Permissions-Policy = "geolocation=(), microphone=()"
```

I added this line because I explicitly wanted to tell the browser that I do not ever want to ask the user for their location or to use their microphone. I'll probably add more things I don't want to this list. You just want to read, I don't want to hassle you!

## Content-Security-Policy

```toml
Content-Security-Policy = "default-src https://kieran-mcguire.uk https://kieran-mcguire.netlify.app; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
```

This line caused me the most pain. I'm basically trying to tell the browser that it should trust assets from the two domains listed. The unspoken implication there is that I'm _not_ expecting to load assets from domains other than the two I've specified, so the browser should reject those assets if that ever happens.

However, I initially started the Content Security Policy (CSP) without this part - `script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'` - and found that my theme stopped working.

What the site wants to do is inline some CSS and JS (e.g. prism.js provides the theme-appropriate code highlighting) into the HTML, probably for the sake of speed. That inlining was being blocked, so what I was seeing was an ugly, un-styled page.

Unless you tell it otherwise, your CSP will prevent inlining by default. The reason for this is: if attackers have control of a remote asset that your site uses, they could use that asset to inline malicious code directly into your page. It is a risk that should be avoided if possible.

By adding `script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'` I'm telling the browser to allow script and style assets from my site alone to inline into HTML. This undermines the integrity of the Content-Security-Policy a little, but I don't have another option at the moment.

## Resources

These things were crucial and helped me work out what I was doing, and what I wanted. I recommend you read them!

- <https://docs.netlify.com/routing/headers/>
- <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control>
- <https://securityheaders.com/>
- <https://scotthelme.co.uk/content-security-policy-an-introduction/>
- <https://scotthelme.co.uk/goodbye-feature-policy-and-hello-permissions-policy/>
- <https://scotthelme.co.uk/a-new-security-header-referrer-policy/>
