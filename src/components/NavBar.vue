<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

// Define the structure for navigation components
interface NavComponent {
  title: string
  href: string
  description: string
}

const components: NavComponent[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/components/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/components/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/components/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/components/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/components/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/components/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
]
</script>

<template>
  <!-- Main navigation bar container -->
  <nav class="backdrop-blur bg-background/80 border-b border-border shadow-sm fixed top-0 left-0 w-full z-50">
    <div class="container mx-auto flex items-center justify-between py-2 px-4">
      <!-- Logo and Site Title -->
      <div class="flex items-center gap-2">
        <img src="/Logo.svg" alt="YMTV Logo" class="w-10 h-10 rounded-lg shadow" />
        <span class="font-bold text-xl tracking-wide text-primary">YMTV</span>
      </div>

      <!-- Desktop Navigation Menu (hidden on small screens) -->
      <NavigationMenu class="hidden md:flex">
        <NavigationMenuList>
          <!-- Home Link -->
          <NavigationMenuItem>
            <RouterLink to="/">
              <Button variant="ghost" class="text-base font-medium px-4 py-2">首页</Button>
            </RouterLink>
          </NavigationMenuItem>

          <!-- Getting Started Dropdown -->
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
                <li class="row-span-3">
                  <NavigationMenuLink as-child>
                    <a
                      class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/"
                    >
                      <!-- Placeholder image for Shadcn UI logo -->
                      <img src="https://www.reka-ui.com/logo.svg" alt="Shadcn UI Logo" class="h-6 w-6">
                      <div class="mb-2 mt-4 text-lg font-medium">
                        shadcn/ui
                      </div>
                      <p class="text-sm leading-tight text-muted-foreground">
                        Beautifully designed components built with Radix UI and
                        Tailwind CSS.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink as-child>
                    <a
                      href="/docs/introduction"
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div class="text-sm font-medium leading-none">Introduction</div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Re-usable components built using Radix UI and Tailwind CSS.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink as-child>
                    <a
                      href="/docs/installation"
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div class="text-sm font-medium leading-none">Installation</div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        How to install dependencies and structure your app.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink as-child>
                    <a
                      href="/docs/typography"
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div class="text-sm font-medium leading-none">Typography</div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Styles for headings, paragraphs, lists...etc
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <!-- Components Dropdown -->
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                <li v-for="component in components" :key="component.title">
                  <NavigationMenuLink as-child>
                    <a
                      :href="component.href"
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div class="text-sm font-medium leading-none">{{ component.title }}</div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {{ component.description }}
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <!-- Documentation Link -->
          <NavigationMenuItem>
            <NavigationMenuLink href="/docs/introduction" :class="navigationMenuTriggerStyle()">
              Documentation
            </NavigationMenuLink>
          </NavigationMenuItem>

          <!-- About Us Link -->
          <NavigationMenuItem>
            <RouterLink to="/about">
              <Button variant="ghost" class="text-base font-medium px-4 py-2">关于我们</Button>
            </RouterLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <!-- Mobile Dropdown Menu (hidden on large screens) -->
      <div class="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="outline" size="icon">
              <!-- Hamburger Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem as-child>
              <RouterLink to="/">首页</RouterLink>
            </DropdownMenuItem>
            <DropdownMenuItem as-child>
              <RouterLink to="/about">关于我们</RouterLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href="/docs/introduction">Documentation</a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href="#">Getting Started (Placeholder)</a>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <a href="#">Components (Placeholder)</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* 导航栏整体样式：毛玻璃+渐变+阴影 */
.nav-bar {
  background: linear-gradient(90deg, rgba(34,40,49,0.85) 0%, rgba(57,62,70,0.85) 100%);
  color: #f8f8f8;
  padding: 0.7rem 0;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 1000;
  backdrop-filter: blur(16px) saturate(180%);
  box-shadow: 0 4px 24px 0 rgba(34,40,49,0.10);
  border-bottom: 1.5px solid rgba(255,255,255,0.08);
  transition: background 0.3s;
}

/* Responsive adjustments from your original code */
@media (max-width: 900px) {
  .nav-content {
    max-width: 98vw;
    padding: 0 1vw;
  }
  .nav-links {
    gap: 1.2rem;
  }
  .logo-img {
    width: 38px;
    height: 38px;
    margin-right: 8px;
  }
  .nav-logo {
    font-size: 1.3rem;
  }
}

@media (max-width: 600px) {
  .nav-content {
    flex-direction: column;
    align-items: stretch;
    padding: 0 2vw;
    gap: 0.5rem;
  }
  .nav-logo {
    justify-content: center;
    margin-bottom: 0.5rem;
  }
  .nav-links {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .nav-links a {
    width: 100%;
    text-align: center;
    padding: 0.7rem 0;
    font-size: 1rem;
  }
}
</style>