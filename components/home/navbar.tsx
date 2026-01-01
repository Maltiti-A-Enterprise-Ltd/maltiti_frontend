'use client';
import React, { JSX, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Menu,
  User,
  Settings,
  LogOut,
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  Info,
  ShoppingBag,
  HelpCircle,
  Phone,
  Home,
  UserPlus,
} from 'lucide-react';
import { CompanyLogo } from '@/app/assets';
import CartIcon from './cart-icon';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { selectIsAuthenticated, selectUser } from '@/lib/store/features/auth/authSlice';
import { logout } from '@/lib/store/features/auth';

interface CartItem {
  id: string;
  quantity: number;
  product: {
    image: string;
    name: string;
    weight: number;
    retail: number;
  };
}

export function NavBar(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get auth state from Redux
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const cart: CartItem[] = []; // Placeholder
  const cartTotal = cart.length;
  const totalPrice = 0; // Placeholder

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle logout
  const handleLogout = async (): Promise<void> => {
    try {
      await dispatch(logout()).unwrap();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name: string): string => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const desktopNavLinks =
    pathname === '/' ? (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/#about" className={navigationMenuTriggerStyle()}>
              About
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/shop" className={navigationMenuTriggerStyle()}>
              Shop
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/#faqs" className={navigationMenuTriggerStyle()}>
              Faqs
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/#contactus" className={navigationMenuTriggerStyle()}>
              Contact Us
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ) : (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/" className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

  const userLinks =
    isAuthenticated && user ? (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={undefined} alt={user.name} />
            <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/orders" className="cursor-pointer">
              <ShoppingBag className="mr-2 h-4 w-4" />
              My Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) : (
      <div className="flex items-center gap-x-4 max-sm:hidden">
        <Link href="/auth/login" className="max-md:mr-3 md:ml-12">
          Login
        </Link>
        <Button asChild className="rounded-full">
          <Link href="/auth/signup">Sign Up</Link>
        </Button>
      </div>
    );

  const logoLink = (
    <Link href="/" className="flex items-center border-b-0 text-sm font-black max-md:hidden">
      <Image src={CompanyLogo} alt="logo" width={40} height={40} />
    </Link>
  );
  const toggleCart = (): void => setIsCartOpen(!isCartOpen);

  return (
    <header className="header-light fixed top-0 right-0 left-0 z-50 mx-auto flex h-20 items-center justify-between border-b-2 bg-white px-8">
      {/* Desktop Logo */}
      <div className="hidden items-center md:flex">{logoLink}</div>
      {/* Desktop Links */}
      <div className="hidden items-center md:flex">{desktopNavLinks}</div>
      {/* Mobile Container */}
      <div className="flex items-center md:hidden">
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="text-primary z-20 mr-4 transition duration-300 hover:text-black focus:outline-none md:hidden">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-col space-y-2">
              {pathname === '/' ? (
                <>
                  <Link
                    href="/#about"
                    className="hover:text-primary flex items-center space-x-3 rounded-lg px-4 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Info className="h-5 w-5" />
                    <span>About</span>
                  </Link>
                  <Link
                    href="/shop"
                    className="hover:text-primary flex items-center space-x-3 rounded-lg px-4 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span>Shop</span>
                  </Link>
                  <Link
                    href="/#faqs"
                    className="hover:text-primary flex items-center space-x-3 rounded-lg px-4 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span>FAQs</span>
                  </Link>
                  <Link
                    href="/terms"
                    className="hover:text-primary flex items-center space-x-3 rounded-lg px-4 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Info className="h-5 w-5" />
                    <span>Terms</span>
                  </Link>
                  <Link
                    href="/privacy"
                    className="hover:text-primary flex items-center space-x-3 rounded-lg px-4 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Info className="h-5 w-5" />
                    <span>Privacy</span>
                  </Link>
                  <Link
                    href="/#contactus"
                    className="hover:text-primary flex items-center space-x-3 rounded-lg px-4 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Phone className="h-5 w-5" />
                    <span>Contact Us</span>
                  </Link>
                </>
              ) : (
                <Link
                  href="/"
                  className="hover:text-primary flex items-center space-x-3 rounded-lg px-4 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-100"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
              )}
              {/* Mobile User Links */}
              <div className="mt-6 border-t pt-4">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    {/* User Info */}
                    <div className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    {/* User Menu Items */}
                    <Link
                      href="/orders"
                      className="hover:text-primary flex items-center space-x-3 rounded-lg px-4 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="hover:text-primary flex items-center space-x-3 rounded-lg px-4 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="hover:text-primary flex items-center space-x-3 rounded-lg px-4 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="hover:text-primary flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-lg font-medium text-red-600 transition-colors hover:bg-gray-100"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      className="hover:text-primary flex items-center space-x-3 rounded-lg px-4 py-3 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                    <div className="mx-4">
                      <Button
                        asChild
                        className="w-full justify-start rounded-lg py-3 text-lg font-medium text-white"
                      >
                        <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                          <UserPlus className="h-5 w-5" />
                          <span>Sign Up</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 justify-center">{logoLink}</div>
      </div>
      {/* User Links and Cart */}
      <div className="flex items-center gap-x-4">
        {userLinks}
        <CartIcon cartTotal={cartTotal} onClick={toggleCart} />
      </div>
      {/* Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-96 bg-green-50">
          <SheetHeader>
            <SheetTitle>Your Cart</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="animate-bounce">
                  <ShoppingCart className="h-24 w-24 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
                <p className="mt-2 text-sm text-gray-500">Add some items to get started!</p>
                <Button className="mt-4" onClick={() => setIsCartOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-between">
                  <span className="font-bold">Subtotal</span>
                  <span className="font-bold">GH₵ {totalPrice}</span>
                </div>
                <div className="mb-4 text-xs text-red-600">
                  Shipping or delivery fees will be calculated during checkout
                </div>
                <div className="mb-4 flex justify-between">
                  <span>{cartTotal} Products in your cart</span>
                  <Button>Checkout</Button>
                </div>
                <ul className="space-y-4">
                  {cart.map((item) => (
                    <li key={item.id} className="flex rounded-md bg-gray-200 p-4">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={80}
                        height={80}
                        className="rounded-md"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">{item.product.weight}g</p>
                        <p className="text-sm">GH₵ {item.product.retail}</p>
                        <div className="mt-2 flex items-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => {}}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span>{item.quantity}</span>
                          <Button size="sm" variant="outline" onClick={() => {}}>
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => {}}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
