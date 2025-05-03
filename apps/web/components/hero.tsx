"use client"

import { useState } from "react"
import { ArrowRight, Github, Copy, Check } from "lucide-react"
import * as motion from "./motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "./ui/card"
// import { ThemeExample } from "./examples/theme-example"
// import { CartExample } from "./examples/cart-example"
// import { DrawingExample } from "./examples/drawing-example"

export function Hero() {
	const [activeTab, setActiveTab] = useState("theme")
	const [activeCodeTab, setActiveCodeTab] = useState("atom")
	const [copied, setCopied] = useState(false)

	// Theme example code files
	const themeCodeFiles = {
		atom: {
			name: "theme.ts",
			code: `import { atom } from '@lfades/atom';

// Create a theme atom with initial value
export const themeAtom = atom<'light' | 'dark' | 'system'>('system');`,
		},
		selector: {
			name: "theme-selector.tsx",
			code: `import { useTheme } from 'next-themes';
import { useAtom } from '@lfades/atom';
import { Sun, Moon, Laptop } from 'lucide-react';
import { themeAtom } from '../atoms/theme';

export function ThemeSelector() {
  const { setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useAtom(themeAtom);

  // Sync the atom with next-themes
  const updateTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <div>
      <h4>Theme Selector Component</h4>
      <div className="flex gap-2">
        <button onClick={() => updateTheme('light')}>
          <Sun /> Light
        </button>
        <button onClick={() => updateTheme('dark')}>
          <Moon /> Dark
        </button>
        <button onClick={() => updateTheme('system')}>
          <Laptop /> System
        </button>
      </div>
    </div>
  );
}`,
		},
		display: {
			name: "theme-display.tsx",
			code: `import { useAtom } from '@lfades/atom';
import { Sun, Moon, Laptop } from 'lucide-react';
import { themeAtom } from '../atoms/theme';

export function ThemeDisplay() {
  const [theme] = useAtom(themeAtom);

  return (
    <div>
      <h4>Theme Display Component</h4>
      <p>Current theme from atom: {theme}</p>
      <div>
        {theme === 'light' && <Sun />}
        {theme === 'dark' && <Moon />}
        {theme === 'system' && <Laptop />}
      </div>
    </div>
  );
}`,
		},
	}

	// Cart example code files
	const cartCodeFiles = {
		atom: {
			name: "cart.ts",
			code: `import { atom } from '@lfades/atom';

// Define types
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

// Create a cart atom with initial empty array
export const cartAtom = atom<CartItem[]>([]);`,
		},
		productCard: {
			name: "product-card.tsx",
			code: `import { useAtom } from '@lfades/atom';
import { Plus } from 'lucide-react';
import { cartAtom, Product } from '../atoms/cart';

export function ProductCard({ product }: { product: Product }) {
  const [cart, setCart] = useAtom(cartAtom);

  const cartItem = cart.find((item) => item.id === product.id);
  const isInCart = !!cartItem;

  const addToCart = () => {
    if (isInCart) {
      setCart(cart.map((item) => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h4>{product.name}</h4>
        <p>\${product.price.toFixed(2)}</p>
      </div>
      <div>
        {isInCart && <span>{cartItem.quantity} in cart</span>}
        <button onClick={addToCart}>
          <Plus /> Add
        </button>
      </div>
    </div>
  );
}`,
		},
		cartIcon: {
			name: "cart-icon.tsx",
			code: `import { useAtom } from '@lfades/atom';
import { ShoppingCart } from 'lucide-react';
import { cartAtom } from '../atoms/cart';

export function CartIcon() {
  const [cart] = useAtom(cartAtom);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => 
    total + item.price * item.quantity, 0);

  return (
    <button className="relative">
      <ShoppingCart />
      {itemCount > 0 && <span className="absolute">{itemCount}</span>}
      <span className="sr-only">
        \${totalPrice.toFixed(2)} - {itemCount} items
      </span>
    </button>
  );
}`,
		},
	}

	// Drawing example code files
	const drawingCodeFiles = {
		atom: {
			name: "drawing-atoms.ts",
			code: `import { atom } from '@lfades/atom';

// Types for our drawing app
interface Point {
  x: number;
  y: number;
}

interface Line {
  points: Point[];
  color: string;
  width: number;
}

interface CursorPosition {
  x: number;
  y: number;
  isDrawing: boolean;
}

// Create atoms for our drawing app
export const linesAtom = atom<Line[]>([]);
export const cursorPositionAtom = atom<CursorPosition>({ 
  x: 0, 
  y: 0, 
  isDrawing: false 
});
export const toolSettingsAtom = atom<{ 
  color: string; 
  width: number 
}>({ 
  color: "#000000", 
  width: 5 
});`,
		},
		canvas: {
			name: "drawing-canvas.tsx",
			code: `import { useRef, useEffect, useState } from 'react';
import { useAtom } from '@lfades/atom';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { 
  linesAtom, 
  cursorPositionAtom, 
  toolSettingsAtom 
} from '../atoms/drawing-atoms';

export function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lines, setLines] = useAtom(linesAtom);
  const [cursorPosition, setCursorPosition] = useAtom(cursorPositionAtom);
  const [toolSettings] = useAtom(toolSettingsAtom);
  const [currentLine, setCurrentLine] = useState(null);

  // Set up canvas and context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all lines
    lines.forEach((line) => {
      if (line.points.length < 2) return;

      ctx.beginPath();
      ctx.moveTo(line.points[0].x, line.points[0].y);
      
      for (let i = 1; i < line.points.length; i++) {
        ctx.lineTo(line.points[i].x, line.points[i].y);
      }
      
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });

    // Draw current line if it exists
    if (currentLine && currentLine.points.length > 1) {
      // Drawing code for current line...
    }
  }, [lines, currentLine]);

  // Handle mouse events
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentLine({
      points: [{ x, y }],
      color: toolSettings.color,
      width: toolSettings.width,
    });

    setCursorPosition({ x, y, isDrawing: true });
  };

  const draw = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCursorPosition({ x, y, isDrawing: cursorPosition.isDrawing });

    if (!cursorPosition.isDrawing) return;
    if (!currentLine) return;

    setCurrentLine({
      ...currentLine,
      points: [...currentLine.points, { x, y }],
    });
  };

  const stopDrawing = () => {
    if (currentLine && currentLine.points.length > 1) {
      setLines([...lines, currentLine]);
    }
    setCurrentLine(null);
    setCursorPosition({ ...cursorPosition, isDrawing: false });
  };

  const clearCanvas = () => {
    setLines([]);
    setCurrentLine(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="cursor-crosshair rounded-md border"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={clearCanvas}>
          <Trash2 className="mr-2 h-4 w-4" /> Clear Canvas
        </Button>
      </div>
    </div>
  );
}`,
		},
		cursor: {
			name: "cursor-position.tsx",
			code: `import { useAtom } from '@lfades/atom';
import { cursorPositionAtom } from '../atoms/drawing-atoms';

export function CursorPositionDisplay() {
  const [cursorPosition] = useAtom(cursorPositionAtom);

  return (
    <div className="rounded-md border px-2 py-1 text-xs">
      <span className="font-mono">
        x: {Math.round(cursorPosition.x)}, 
        y: {Math.round(cursorPosition.y)}
        {cursorPosition.isDrawing ? " (drawing)" : ""}
      </span>
    </div>
  );
}`,
		},
		tools: {
			name: "tool-settings.tsx",
			code: `import { useAtom } from '@lfades/atom';
import { Slider } from '@/components/ui/slider';
import { Paintbrush } from 'lucide-react';
import { toolSettingsAtom } from '../atoms/drawing-atoms';

export function ToolSettings() {
  const [toolSettings, setToolSettings] = useAtom(toolSettingsAtom);
  const colors = ["#000000", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"];

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-1">
        {colors.map((color) => (
          <button
            key={color}
            className={\`h-6 w-6 rounded-full \${
              toolSettings.color === color ? "ring-2 ring-blue-500" : ""
            }\`}
            style={{ backgroundColor: color }}
            onClick={() => setToolSettings({ ...toolSettings, color })}
          />
        ))}
      </div>
      <div className="flex w-32 items-center gap-2">
        <Paintbrush className="h-4 w-4" />
        <Slider
          value={[toolSettings.width]}
          min={1}
          max={20}
          step={1}
          onValueChange={(value) => 
            setToolSettings({ ...toolSettings, width: value[0] })
          }
        />
      </div>
    </div>
  );
}`,
		},
	}

	// Reset code tab when changing example tab
	const handleExampleTabChange = (value: string) => {
		setActiveTab(value)
		setActiveCodeTab("atom") // Reset to atom tab when switching examples
	}

	// Get active code files based on current example
	const getActiveCodeFiles = () => {
		if (activeTab === "theme") return themeCodeFiles
		if (activeTab === "cart") return cartCodeFiles
		return drawingCodeFiles
	}

	// Get current code file
	const getCurrentCodeFile = () => {
		const files = getActiveCodeFiles()
		return files[activeCodeTab as keyof typeof files] || files.atom
	}

	const copyToClipboard = async () => {
		await navigator.clipboard.writeText(getCurrentCodeFile().code)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<section className="relative overflow-hidden bg-gradient-to-b from-pane to-pane-2 py-20">
			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-4xl text-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
							@lfades/atom
						</h1>
						<p className="mt-6 text-xl leading-8">
							Straightforward state management for React in just 83 lines of
							code.
						</p>
					</motion.div>
					<motion.div
						className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<Button asChild size="lg" className="h-12">
							<a href="#installation">
								Get Started <ArrowRight className="ml-2 h-4 w-4" />
							</a>
						</Button>
						<Button asChild variant="outline" size="lg" className="h-12">
							<a
								href="https://github.com/lfades/atom"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Github className="mr-2 h-4 w-4" /> GitHub
							</a>
						</Button>
					</motion.div>
				</div>

				<motion.div
					className="mt-16 grid gap-8 lg:grid-cols-2"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
				>
					<Card className="flex h-[500px] flex-col overflow-hidden">
						<div className="flex items-center justify-between px-4">
							<Tabs
								value={activeCodeTab}
								onValueChange={setActiveCodeTab}
								className="w-full"
							>
								<TabsList className="h-10 w-full justify-start rounded-none bg-transparent p-0">
									{Object.entries(getActiveCodeFiles()).map(([key, file]) => (
										<TabsTrigger
											key={key}
											value={key}
											className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
										>
											{file.name}
										</TabsTrigger>
									))}
								</TabsList>
							</Tabs>
							<button
								onClick={copyToClipboard}
								className="flex items-center text-xs font-medium text-gray-400 hover:text-white"
							>
								{copied ? (
									<>
										<Check className="mr-1 h-3.5 w-3.5" /> Copied
									</>
								) : (
									<>
										<Copy className="mr-1 h-3.5 w-3.5" /> Copy
									</>
								)}
							</button>
						</div>

						<div className="flex-1 overflow-hidden">
							<pre className="h-full overflow-auto p-4 text-sm text-gray-300">
								<code className="language-tsx">
									{getCurrentCodeFile().code}
								</code>
							</pre>
						</div>
					</Card>

					{/* Live examples on the right */}
					<div className="flex flex-col justify-center">
						<h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
							See it in action
						</h2>
						<p className="mb-6 text-gray-600 dark:text-gray-300">
							These examples demonstrate how atoms share state across
							components.
						</p>

						<Tabs
							defaultValue="theme"
							value={activeTab}
							onValueChange={handleExampleTabChange}
							className="w-full"
						>
							<TabsList className="grid w-full grid-cols-3">
								<TabsTrigger value="theme">Theme Switcher</TabsTrigger>
								<TabsTrigger value="cart">Shopping Cart</TabsTrigger>
								<TabsTrigger value="drawing">Drawing Tool</TabsTrigger>
							</TabsList>
							{/* <TabsContent value="theme" className="mt-4"> */}
							{/* 	<ThemeExample /> */}
							{/* </TabsContent> */}
							{/* <TabsContent value="cart" className="mt-4"> */}
							{/* 	<CartExample /> */}
							{/* </TabsContent> */}
							{/* <TabsContent value="drawing" className="mt-4"> */}
							{/* 	<DrawingExample /> */}
							{/* </TabsContent> */}
						</Tabs>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
