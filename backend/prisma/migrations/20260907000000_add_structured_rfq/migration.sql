-- CreateEnum
CREATE TYPE "InquirySource" AS ENUM ('WEBSITE', 'EMAIL', 'WHATSAPP', 'MANUAL', 'LEGACY');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InquiryStatus" ADD VALUE 'NEW';
ALTER TYPE "InquiryStatus" ADD VALUE 'REVIEWING';
ALTER TYPE "InquiryStatus" ADD VALUE 'CLARIFICATION_REQUIRED';
ALTER TYPE "InquiryStatus" ADD VALUE 'QUOTE_PREPARING';
ALTER TYPE "InquiryStatus" ADD VALUE 'NEGOTIATION';
ALTER TYPE "InquiryStatus" ADD VALUE 'WON';
ALTER TYPE "InquiryStatus" ADD VALUE 'LOST';
ALTER TYPE "InquiryStatus" ADD VALUE 'DORMANT';

-- AlterTable
ALTER TABLE "Inquiry" ADD COLUMN     "city" TEXT,
ADD COLUMN     "contactPerson" TEXT,
ADD COLUMN     "deliveryLocation" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "gstNumber" TEXT,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "requiredDeliveryDate" DATE,
ADD COLUMN     "rfqNumber" TEXT,
ADD COLUMN     "source" "InquirySource" NOT NULL DEFAULT 'LEGACY',
ALTER COLUMN "requirements" DROP NOT NULL;

-- CreateTable
CREATE TABLE "InquiryItem" (
    "id" TEXT NOT NULL,
    "inquiryId" TEXT NOT NULL,
    "materialGrade" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "od" DECIMAL(12,2),
    "idDimension" DECIMAL(12,2),
    "length" DECIMAL(12,2),
    "quantity" DECIMAL(12,4) NOT NULL,
    "quantityUnit" TEXT NOT NULL,
    "process" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InquiryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RfqCounter" (
    "year" INTEGER NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RfqCounter_pkey" PRIMARY KEY ("year")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inquiry_rfqNumber_key" ON "Inquiry"("rfqNumber");

-- AddForeignKey
ALTER TABLE "InquiryItem" ADD CONSTRAINT "InquiryItem_inquiryId_fkey" FOREIGN KEY ("inquiryId") REFERENCES "Inquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
