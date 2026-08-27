<?php

namespace Database\Seeders;

use App\Models\DocumentType;
use Illuminate\Database\Seeder;

class DocumentTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'name' => 'Barangay Certificate',
                'slug' => 'barangay-certificate',
                'description' => 'Official certification of bona fide residency in Barangay Lallana for employment, postal, or general proof of residence.',
                'fee_cents' => 5000, // PHP 50.00
                'requirements' => [
                    'Valid Government ID',
                    'Proof of Residency (Utility Bill or Household Record)',
                ],
                'form_schema' => [
                    ['name' => 'purpose', 'label' => 'Purpose of Certification', 'type' => 'text', 'required' => true],
                    ['name' => 'years_of_residency', 'label' => 'Years of Residency in Barangay', 'type' => 'number', 'required' => true],
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Barangay Clearance',
                'slug' => 'barangay-clearance',
                'description' => 'Official document certifying good moral character and no derogatory record within Barangay Lallana jurisdiction.',
                'fee_cents' => 5000, // PHP 50.00
                'requirements' => [
                    'Valid Government ID',
                    'Verified Household Membership',
                    'Recent 2x2 ID Photo',
                ],
                'form_schema' => [
                    ['name' => 'purpose', 'label' => 'Purpose / Organization', 'type' => 'text', 'required' => true],
                    ['name' => 'ctc_number', 'label' => 'Community Tax Certificate (Cedula) No.', 'type' => 'text', 'required' => false],
                ],
                'is_active' => true,
            ],
            [
                'name' => 'Certificate of Indigency',
                'slug' => 'certificate-of-indigency',
                'description' => 'Certification issued to indigent residents seeking financial, medical, educational, or legal assistance from government or private agencies.',
                'fee_cents' => 0, // Free of charge
                'requirements' => [
                    'Valid Government ID or School ID',
                    'Verified Household Record',
                    'Hospital / School Referral or Billing Assessment',
                ],
                'form_schema' => [
                    ['name' => 'assistance_type', 'label' => 'Type of Assistance (Medical, Educational, Burial, Financial, Legal)', 'type' => 'text', 'required' => true],
                    ['name' => 'requesting_agency', 'label' => 'Target Agency / Institution (DSWD, PCSO, Public Hospital)', 'type' => 'text', 'required' => true],
                ],
                'is_active' => true,
            ],
        ];

        foreach ($types as $type) {
            DocumentType::updateOrCreate(['slug' => $type['slug']], $type);
        }
    }
}
