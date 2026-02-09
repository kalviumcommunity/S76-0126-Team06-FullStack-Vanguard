'use client';

import * as React from "react"
import { ArrowDown, ArrowUp, LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
    title: string
    value: string | number
    icon?: LucideIcon
    description?: string
    variant?: "default" | "success" | "warning" | "danger"
    trend?: {
        value: number
        label: string
    }
    className?: string
}

export function StatCard({
    title,
    value,
    icon: Icon,
    description,
    variant = "default",
    trend,
    className,
}: StatCardProps) {
    const getVariantStyles = (variant: string) => {
        switch (variant) {
            case "success": return "bg-green-50 text-green-900 border-green-200"
            case "warning": return "bg-yellow-50 text-yellow-900 border-yellow-200"
            case "danger": return "bg-red-50 text-red-900 border-red-200"
            default: return "bg-card text-card-foreground"
        }
    }

    return (
        <Card className={cn("hover:shadow-md transition-shadow", getVariantStyles(variant), className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {Icon && (
                    <Icon className="h-4 w-4 text-muted-foreground opacity-70" />
                )}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
                {trend && (
                    <p className={cn(
                        "text-xs flex items-center mt-1",
                        trend.value > 0 ? "text-green-600" : "text-red-600"
                    )}>
                        {trend.value > 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                        {Math.abs(trend.value)}%
                        <span className="text-muted-foreground ml-1">
                            {trend.label}
                        </span>
                    </p>
                )}
            </CardContent>
        </Card>
    )
}
