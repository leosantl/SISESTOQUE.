-- Create enum for product status
CREATE TYPE product_status AS ENUM ('active', 'inactive', 'expired');

-- Create products table
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0,
    quantity INTEGER NOT NULL DEFAULT 0,
    min_quantity INTEGER NOT NULL DEFAULT 5,
    expire_date DATE,
    status product_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, code)
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own products" 
ON public.products 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" 
ON public.products 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" 
ON public.products 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create stock movements table
CREATE TABLE public.stock_movements (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('in', 'out')),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for stock movements
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Create policies for stock movements
CREATE POLICY "Users can view their own stock movements" 
ON public.stock_movements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stock movements" 
ON public.stock_movements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update product quantity based on stock movements
CREATE OR REPLACE FUNCTION public.update_product_quantity()
RETURNS TRIGGER AS $$
BEGIN
    -- Update product quantity based on movement type
    IF NEW.movement_type = 'in' THEN
        UPDATE public.products 
        SET quantity = quantity + NEW.quantity
        WHERE id = NEW.product_id;
    ELSIF NEW.movement_type = 'out' THEN
        UPDATE public.products 
        SET quantity = quantity - NEW.quantity
        WHERE id = NEW.product_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to update product quantity when stock movement is created
CREATE TRIGGER update_quantity_on_movement
    AFTER INSERT ON public.stock_movements
    FOR EACH ROW
    EXECUTE FUNCTION public.update_product_quantity();